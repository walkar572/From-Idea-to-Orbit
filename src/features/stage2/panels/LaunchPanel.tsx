import { OptionCard } from '../../../components/ui/OptionCard';
import { useGame } from '../../../context/GameContext';
import { SEGMENTS_DB } from '../../../data/modules';
import type { ArchitectureEval } from '../../../types';
import { SegmentPanelHeader } from './SegmentPanelHeader';
import { useSegmentSelect } from './useSegmentSelect';

export function LaunchPanel({ ev }: { ev: ArchitectureEval }) {
    const { state } = useGame();
    const select = useSegmentSelect();
    const m = ev.m;

    return (
        <>
            <SegmentPanelHeader
                kicker="SEGMENT 1 OF 4 // LAUNCH SEGMENT (NASA WEBINAR PAGES 8, 17, 24)"
                title="Launch Vehicle Selection & Payload Stowage Services"
                aside="Mass & Volume Envelope"
                asideClassName="text-slate-400"
            />
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
                        <OptionCard
                            key={lv.id}
                            selected={active}
                            onSelect={() => select('launchId', lv.id)}
                            className="h-full p-4 border-2 flex flex-col justify-between"
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
                        </OptionCard>
                    );
                })}
            </div>
        </>
    );
}
