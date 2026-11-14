import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { evaluateArchitecture, getConfigKey, getLaunchHold } from '../engine/systemsEngineering';
import type { Stage } from '../types';

interface HeaderProps {
    onOpenDocs: () => void;
}

const SE_STEPS = [
    '1. Identify Need & Goals',
    '2. Define Concept (ConOps)',
    '3. Define Requirements',
    '4. Design (MDL Trades)',
    '5. Build & Verify',
    '6. Implement (Flight)',
] as const;

export function Header({ onOpenDocs }: HeaderProps) {
    const { state, dispatch, muted, toggleMute, playTone, showToast } = useGame();
    const ev = evaluateArchitecture(state);
    const headerRef = useRef<HTMLElement>(null);
    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;
        const publish = () =>
            document.documentElement.style.setProperty('--header-h', `${Math.ceil(el.getBoundingClientRect().height)}px`);
        publish();
        const ro = new ResizeObserver(publish);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);
    const goToStage = (n: Stage) => {
        if (n !== 3 || state.flownConfigKey === getConfigKey(state)) {
            playTone(600);
            dispatch({ type: 'GO_TO_STAGE', stage: n });
            return;
        }
        const hold = getLaunchHold(ev);
        if (hold) {
            playTone(220, '8n');
            showToast(hold);
            dispatch({ type: 'GO_TO_STAGE', stage: 2 });
            return;
        }
        playTone(600);
        dispatch({ type: 'START_SIM' });
    };

    const cmlBadgeClass =
    ev.cmlLevel === 4
        ? 'bg-blue-500/30 text-blue-200 border-blue-400/60'
        : ev.cmlLevel === 3
        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
        : 'bg-slate-700/60 text-slate-300 border-slate-600';

    let activeStepLimit = 1;
    if (state.stage === 1) activeStepLimit = 2;
    if (state.stage === 2) activeStepLimit = ev.cmlLevel === 4 ? 5 : 4;
    if (state.stage === 3) activeStepLimit = 6;

    const stageButtonClass = (n: Stage) =>
        `px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
            state.stage === n
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-white'
        }`;

    return (
        <header
            ref={headerRef}
            className="relative md:sticky md:top-0 z-40 glass-panel border-b border-blue-500/25 px-3 lg:px-6 py-2.5"
        >
            <div className="max-w-[1440px] mx-auto flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-800 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/40">
                            <i className="fa-solid fa-satellite-dish text-white text-lg" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-blue-900/80 text-blue-300 border border-blue-500/30">
                                    NASA SMD // NPR 7123.1
                                </span>
                                <span
                                    className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded border font-bold ${cmlBadgeClass}`}
                                >
                                    {ev.cmlText}
                                </span>
                                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-slate-700/50 text-slate-400 border border-slate-600 hidden sm:inline">
                                    {ev.mdlText}
                                </span>
                            </div>
                            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                                SPACE MISSION ARCHITECT{' '}
                                <span className="text-blue-400 font-mono text-xs sm:text-sm">
                                    SYSTEMS ENGINEERING EDITION
                                </span>
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-xl border border-slate-800">
                        <button onClick={() => goToStage(1)} className={stageButtonClass(1)}>
                            <span>01.</span>
                            <span>Need & ConOps</span>
                        </button>
                        <i className="fa-solid fa-chevron-right text-slate-600 text-[10px]" />
                        <button onClick={() => goToStage(2)} className={stageButtonClass(2)}>
                            <span>02.</span>
                            <span>4 Segments & MDL</span>
                        </button>
                        <i className="fa-solid fa-chevron-right text-slate-600 text-[10px]" />
                        <button onClick={() => goToStage(3)} className={stageButtonClass(3)}>
                            <span>03.</span>
                            <span>GMAT & Mission Viz</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onOpenDocs}
                            className="px-3 py-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-xs font-mono text-blue-200 border border-blue-500/40 transition flex items-center gap-1.5"
                        >
                            <i className="fa-solid fa-book-open" />
                            <span className="hidden md:inline">NASA SE Guide</span>
                        </button>
                        <button
                            onClick={toggleMute}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-blue-300 border border-slate-700 transition"
                            title="Toggle Telemetry Audio"
                            aria-label="Toggle audio"
                        >
                            <i
                                className={`fa-solid ${
                                    muted ? 'fa-volume-xmark text-slate-500' : 'fa-volume-high text-blue-300'
                                }`}
                            />
                        </button>
                    </div>
                </div>
                <div className="hidden md:grid grid-cols-6 gap-1.5 pt-1 border-t border-slate-800/80 text-[10px] font-mono">
                    {SE_STEPS.map((label, idx) => {
                        const n = idx + 1;
                        const active = n <= activeStepLimit;
                        return (
                            <div
                                key={n}
                                className={`px-2 py-1 rounded border flex items-center justify-between ${
                                    active
                                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-200 font-bold'
                                        : 'bg-slate-900/80 border-slate-800 text-slate-500'
                                }`}
                            >
                                <span className="truncate">{label}</span>
                                {active ? (
                                    <i className="fa-solid fa-circle-dot text-blue-400" />
                                ) : (
                                    <i className="fa-solid fa-circle text-[7px]" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </header>
    );
}