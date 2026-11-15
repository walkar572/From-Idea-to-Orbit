import { useGame } from '../../../context/GameContext';
import { SEGMENTS_DB } from '../../../data/modules';
import type { ArchitectureEval } from '../../../types';

export function LaunchPanel({ ev }: { ev: ArchitectureEval }) {
    const { state, dispatch, playTone } = useGame();
    const m = ev.m;

    return (
        <>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                    <span className="font-mono text-[10px] uppercase text-blue-400 block">
                        SEGMENT 1 OF 4 // LAUNCH SEGMENT (NASA WEBINAR PAGES 8, 17, 24)
                    </span>
                    <h3 className="text-base font-bold text-white">
                        Launch Vehicle Selection & Payload Stowage Services
                    </h3>
                </div>
                <span className="font-mono text-xs text-slate-400">Mass & Volume Envelope</span>
            </div>
            <p className="text-xs text-slate-300">
                The <b>Launch Segment</b> defines the launch vehicle and environmental stowage services required to
                place your mission in space: from ambient-temperature soft-stowed cargo aboard <b>NG-18 Cygnus</b> to
                the heavy-lift <b>NASA SLS</b>, which reduces transit time and increases mass/volume margins.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SEGMENTS_DB.launchVehicles.map(lv => {
                    const active = lv.id === state.launchId;
                    const rec = lv.allowedMissions.includes(m.id);
                    return (
                        <button
                            type="button"
                            key={lv.id}
                            aria-pressed={active}
                            onClick={() => {
                                playTone(680);
                                dispatch({ type: 'SET_LAUNCH', id: lv.id });
                            }}
                            className={`w-full h-full text-left p-4 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                                active
                                    ? 'border-blue-500 bg-blue-950/40 glow-cyan'
                                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                            }`}
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-white text-sm">{lv.name}</span>
                                    {active && <i className="fa-solid fa-circle-check text-blue-400" />}
                                </div>
                                {rec ? (
                                    <span className="inline-block mt-1 font-mono text-[10px] px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-900/60">
                                        Compatible Launch Profile
                                    </span>
                                ) : (
                                    <span className="inline-block mt-1 font-mono text-[10px] px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-900/60">
                                        Non-optimal for this orbit
                                    </span>
                                )}
                                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{lv.desc}</p>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-2.5 border-t border-slate-800 font-mono text-xs">
                                <span className="text-blue-400 font-bold">Cost: ${lv.cost}M</span>
                                <span className="text-blue-300 font-bold">Max Mass: {lv.maxMass} kg</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </>
    );
}