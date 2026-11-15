import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type { ArchitectureEval, VizCamera } from '../types';
import { renderMissionVizCanvas } from '../engine/gmatSimulator';
import { resolveConopsDirective } from '../engine/systemsEngineering';

export type LogType = 'info' | 'ok' | 'warn' | 'err';

export interface LogEntry {
    ts: string;
    msg: string;
    type: LogType;
}

export interface UseSimulationReturn {
    progress: number;
    phase: number;
    showConops: boolean;
    conopsBonus: number;
    debriefShown: boolean;
    logs: LogEntry[];
    start: () => void;
    resolveConops: (option: 1 | 2) => void;
}

const FRAME_MS = 1000 / 60;
const PROGRESS_PER_MS = 0.0036 / FRAME_MS;
const MAX_DT_MS = 100;

const timestamp = () => new Date().toLocaleTimeString([], { hour12: false });

function drawFrame(canvasRef: RefObject<HTMLCanvasElement>, prog: number, ev: ArchitectureEval, vizCamera: VizCamera) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const cssW = Math.floor(rect.width);
    const cssH = Math.floor(rect.height);
    const dpr = window.devicePixelRatio || 1;
    const targetW = Math.round(cssW * dpr);
    const targetH = Math.round(cssH * dpr);
    if (canvas.width !== targetW) canvas.width = targetW;
    if (canvas.height !== targetH) canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderMissionVizCanvas(ctx, cssW, cssH, prog, ev, vizCamera);
}

export function useSimulation(
    ev: ArchitectureEval,
    vizCamera: VizCamera,
    canvasRef: RefObject<HTMLCanvasElement>,
    visible: boolean
): UseSimulationReturn {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState(0);
    const [showConops, setShowConops] = useState(false);
    const [conopsBonus, setConopsBonus] = useState(1.0);
    const [debriefShown, setDebriefShown] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);

    const evRef = useRef(ev);
    const vizCameraRef = useRef(vizCamera);
    const rafRef = useRef<number | null>(null);
    const progressRef = useRef(0);
    const phaseRef = useRef(0);
    const runningRef = useRef(false);
    const eventTriggeredRef = useRef(false);
    const lastTsRef = useRef<number | null>(null);

    useEffect(() => {
        evRef.current = ev;
    }, [ev]);
    useEffect(() => {
        vizCameraRef.current = vizCamera;
    }, [vizCamera]);

    const log = useCallback((msg: string, type: LogType = 'info') => {
        setLogs(prev => [...prev, { ts: timestamp(), msg, type }]);
    }, []);

    const tick = useCallback(() => {
        if (!runningRef.current) return;
        const now = performance.now();
        const dt = lastTsRef.current === null ? FRAME_MS : Math.min(now - lastTsRef.current, MAX_DT_MS);
        lastTsRef.current = now;

        const currentEv = evRef.current;
        progressRef.current = Math.min(1, progressRef.current + PROGRESS_PER_MS * dt);
        const prog = progressRef.current;
        setProgress(prog);

        if (prog >= 0.25 && phaseRef.current === 0) {
            phaseRef.current = 1;
            setPhase(1);
            log(
                `[SPACE SEGMENT] Power system deployed (${currentEv.power.name}). Generating ${currentEv.wattsGenerated}W at target distance.`,
                currentEv.powerOk ? 'ok' : 'warn'
            );
        }

        if (prog >= 0.52 && !eventTriggeredRef.current) {
            eventTriggeredRef.current = true;
            runningRef.current = false;
            phaseRef.current = 2;
            setPhase(2);
            setShowConops(true);
            log(
                `[CONOPS CHECKPOINT] ${currentEv.m.conopsEvent.title} — awaiting Flight Director directive...`,
                'warn'
            );
            drawFrame(canvasRef, prog, currentEv, vizCameraRef.current);
            return;
        }

        if (prog >= 0.78 && phaseRef.current === 2) {
            phaseRef.current = 3;
            setPhase(3);
            log(
                `[GROUND SEGMENT] Downlinking telemetry via ${currentEv.ground.name} (${Math.round(currentEv.groundEff * 100)}% link efficiency).`,
                currentEv.groundOk ? 'ok' : 'warn'
            );
            log(`[USER SEGMENT] Delivering samples/data to: ${currentEv.user.name}.`, currentEv.userOk ? 'ok' : 'warn');
        }

        if (prog >= 1.0) {
            progressRef.current = 1.0;
            runningRef.current = false;
            phaseRef.current = 4;
            setPhase(4);
            setDebriefShown(true);
            setProgress(1.0);
            drawFrame(canvasRef, 1.0, currentEv, vizCameraRef.current);
            return;
        }

        drawFrame(canvasRef, prog, currentEv, vizCameraRef.current);
        rafRef.current = requestAnimationFrame(tick);
    }, [canvasRef, log]);

    const start = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        progressRef.current = 0;
        phaseRef.current = 0;
        runningRef.current = true;
        eventTriggeredRef.current = false;
        lastTsRef.current = null;

        setProgress(0);
        setPhase(0);
        setShowConops(false);
        setConopsBonus(1.0);
        setDebriefShown(false);

        const e = evRef.current;
        const ts = timestamp();
        setLogs([
            {
                ts,
                msg: `[LAUNCH SEGMENT] Liftoff aboard ${e.launch.name}. Mass verified: ${e.totalMass}/${e.launch.maxMass} kg, Volume: ${e.totalVol}/${e.maxAllowedVol} units.`,
                type: 'ok',
            },
            {
                ts,
                msg: `[GMAT ENGINE] Propagating trajectory: ${e.prop.name} (Delta-V = ${e.prop.dvProvided} km/s).`,
                type: 'info',
            },
        ]);

        rafRef.current = requestAnimationFrame(tick);
    }, [tick]);

    const resolveConops = useCallback(
        (option: 1 | 2) => {
            if (runningRef.current) return;
            setShowConops(false);

            const outcome = resolveConopsDirective(evRef.current, option);
            setConopsBonus(outcome.scienceYield);
            log(outcome.message, outcome.severity);

            runningRef.current = true;
            lastTsRef.current = null;
            rafRef.current = requestAnimationFrame(tick);
        },
        [log, tick]
    );

    useEffect(() => {
        if (!visible) {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        } else if (runningRef.current && !rafRef.current) {
            lastTsRef.current = null;
            rafRef.current = requestAnimationFrame(tick);
        }
    }, [visible, tick]);

    useEffect(() => {
        if (!visible) return;
        const redraw = () => drawFrame(canvasRef, progressRef.current, evRef.current, vizCameraRef.current);
        drawFrame(canvasRef, progressRef.current, evRef.current, vizCamera);
        window.addEventListener('resize', redraw);
        return () => window.removeEventListener('resize', redraw);
    }, [vizCamera, visible, canvasRef]);

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            runningRef.current = false;
        };
    }, []);

    return { progress, phase, showConops, conopsBonus, debriefShown, logs, start, resolveConops };
}
