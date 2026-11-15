import { useEffect, useMemo, useRef } from 'react';
import { toggleClass } from '../../components/ui/classes';
import { StatCell } from '../../components/ui/StatCell';
import { useGame } from '../../context/GameContext';
import { evaluateArchitecture, solarFluxPct, solarFluxWm2 } from '../../engine/systemsEngineering';
import { useSimulation } from '../../hooks/useSimulation';
import type { VizCamera } from '../../types';
import { firstWord } from '../../utils/format';
import { MissionVizCanvas } from './MissionVizCanvas';
import { ConopsModal } from './ConopsModal';
import { TelemetryLog } from './TelemetryLog';
import { DebriefCard } from './DebriefCard';

const CAMS: { key: VizCamera; label: string; icon: string }[] = [
    { key: '3d', label: '3D Perspective', icon: 'fa-cube' },
    { key: 'top', label: 'Ecliptic 2D', icon: 'fa-compass' },
    { key: 'follow', label: 'Spacecraft Cam', icon: 'fa-video' },
];

const PHASE_LABELS = [
    'PHASE 1: LAUNCH & ASCENT',
    'PHASE 2: SPACE SEGMENT OPERATIONS',
    'PHASE 3: CONOPS DECISION CHECKPOINT',
    'PHASE 4: GROUND & USER SEGMENT PIPELINE',
    'PHASE 5: MISSION COMPLETE (DEBRIEF)',
];

interface Stage3Props {
    visible: boolean;
}

export function Stage3({ visible }: Stage3Props) {
    const { state, dispatch, playTone } = useGame();
    const flightConfig = state.flownConfig ?? state;
    const ev = useMemo(() => evaluateArchitecture(flightConfig), [flightConfig]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sim = useSimulation(ev, state.vizCamera, canvasRef, visible);
    const startSim = sim.start;
    const lastKeyRef = useRef(state.simRestartKey);
    useEffect(() => {
        if (visible && state.simRestartKey !== lastKeyRef.current) {
            lastKeyRef.current = state.simRestartKey;
            startSim();
        }
    }, [visible, state.simRestartKey, startSim]);

    const setCamera = (camera: VizCamera) => {
        playTone(620);
        dispatch({ type: 'SET_VIZ_CAMERA', camera });
    };

    const curAu = +(1.0 + (ev.m.au - 1.0) * sim.progress).toFixed(2);
    const curFlux = solarFluxWm2(curAu);
    const curPct = solarFluxPct(curAu);
    const remDv = (ev.prop.dvProvided * (1 - sim.progress * 0.8)).toFixed(2);
    const sciPackets = Math.round(sim.progress * 320 * ev.groundEff);

    return (
        <section className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-8 space-y-4">
                    <div className="glass-panel rounded-2xl p-5 border border-blue-500/35 relative">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                        NASA MISSION VIZ + GMAT ENGINE
                                    </span>
                                    <span className="font-mono text-xs text-blue-300 font-bold">
                                        {PHASE_LABELS[Math.min(sim.phase, 4)]}
                                    </span>
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                                    {ev.m.name} — GMAT & Mission Viz Simulation
                                </h3>
                            </div>

                            <div className="flex items-center gap-1.5 bg-slate-950/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                                {CAMS.map(c => (
                                    <button
                                        key={c.key}
                                        onClick={() => setCamera(c.key)}
                                        className={`px-2.5 py-1 rounded-lg ${toggleClass(state.vizCamera === c.key)}`}
                                    >
                                        <i className={`fa-solid ${c.icon} mr-1`} />
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-full h-[460px] sm:h-[400px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                            <MissionVizCanvas canvasRef={canvasRef} />
                            {sim.showConops && (
                                <ConopsModal event={ev.m.conopsEvent} onResolve={sim.resolveConops} />
                            )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-slate-800 font-mono text-xs">
                            <StatCell label="GMAT DELTA-V REMAINING" value={`${remDv} km/s`} valueClassName="text-sm text-blue-300" />
                            <StatCell label="SOLAR FLUX (1/R²)" value={`${curFlux} W/m² (${curPct}%)`} valueClassName="text-sm text-slate-300" />
                            <StatCell
                                label="GROUND SEGMENT LINK"
                                value={`${Math.round(ev.groundEff * 100)}% (${firstWord(ev.ground.name)})`}
                                valueClassName="text-sm text-blue-300"
                            />
                            <StatCell label="USER SEGMENT DATA" value={`${sciPackets} packets`} valueClassName="text-sm text-slate-400" />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-4">
                    <TelemetryLog logs={sim.logs} />
                    {sim.debriefShown && (
                        <DebriefCard
                            ev={ev}
                            conopsBonus={sim.conopsBonus}
                            onBack={() => dispatch({ type: 'GO_TO_STAGE', stage: 2 })}
                            onNew={() => dispatch({ type: 'GO_TO_STAGE', stage: 1 })}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}