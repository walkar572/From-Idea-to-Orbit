import { useGame } from '../../../context/GameContext';
import { SEGMENTS_DB } from '../../../data/modules';
import { GROUND_EFF_MIN } from '../../../engine/systemsEngineering';
import type { ArchitectureEval } from '../../../types';

export function GroundPanel({ ev }: { ev: ArchitectureEval }) {
    const { state, dispatch, playTone } = useGame();
    const m = ev.m;

    return (
        <>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                    <span className="font-mono text-[10px] uppercase text-blue-400 block">
                        SEGMENT 3 OF 4 // GROUND SEGMENT (NASA WEBINAR PAGES 8, 14, 16)
                    </span>
                    <h3 className="text-base font-bold text-white">
                        Ground Stations, Deep Space Network (DSN) & Mission Control
                    </h3>
                </div>
                <span className="font-mono text-xs text-red-400">Command & Telemetry</span>
            </div>
            <p className="text-xs text-slate-300">
                The <b>Ground Segment</b> manages spacecraft communication, real-time experiment monitoring (such as
                monitoring 30°C yeast incubation temperatures for <b>BioNutrients-2</b>), and science data reception.
                Undersized ground antennas at {m.au} AU will cause severe data loss!
            </p>
            <div className="grid grid-cols-1 gap-3">
                {SEGMENTS_DB.groundSegments.map(gs => {
                    const active = gs.id === state.groundId;
                    const eff = gs.efficiency[m.id];
                    const effPct = Math.round(eff * 100);
                    return (
                        <button
                            type="button"
                            key={gs.id}
                            aria-pressed={active}
                            onClick={() => {
                                playTone(680);
                                dispatch({ type: 'SET_GROUND', id: gs.id });
                            }}
                            className={`w-full text-left p-4 rounded-xl border transition cursor-pointer ${
                                active
                                    ? 'border-blue-500 bg-blue-950/40 glow-cyan'
                                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                            }`}
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-bold text-white text-sm">{gs.name}</span>
                                <div className="flex items-center gap-3 font-mono text-xs">
                                    <span className="text-blue-400 font-bold">Cost: ${gs.cost}M</span>
                                    <span
                                        className={`px-2.5 py-0.5 rounded font-bold ${
                                            eff >= GROUND_EFF_MIN
                                                ? 'bg-blue-500/20 text-blue-300'
                                                : 'bg-red-700/20 text-red-400'
                                        }`}
                                    >
                                        Data Downlink for {m.code}: {effPct}%
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{gs.desc}</p>
                        </button>
                    );
                })}
            </div>
        </>
    );
}