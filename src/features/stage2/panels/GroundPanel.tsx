import { OptionCard } from '../../../components/ui/OptionCard';
import { useGame } from '../../../context/GameContext';
import { SEGMENTS_DB } from '../../../data/modules';
import { GROUND_EFF_MIN } from '../../../engine/systemsEngineering';
import type { ArchitectureEval } from '../../../types';
import { SegmentPanelHeader } from './SegmentPanelHeader';
import { useSegmentSelect } from './useSegmentSelect';

export function GroundPanel({ ev }: { ev: ArchitectureEval }) {
    const { state } = useGame();
    const select = useSegmentSelect();
    const m = ev.m;

    return (
        <>
            <SegmentPanelHeader
                kicker="SEGMENT 3 OF 4 // GROUND SEGMENT (NASA WEBINAR PAGES 8, 14, 16)"
                title="Ground Stations, Deep Space Network (DSN) & Mission Control"
                aside="Command & Telemetry"
                asideClassName="text-red-400"
            />
            <p className="text-xs text-slate-300">
                The <b>Ground Segment</b> manages spacecraft communication, real-time experiment monitoring (such as
                monitoring 30°C yeast incubation temperatures for <b>BioNutrients-2</b>), and science data reception.
                Undersized ground antennas at {m.au} AU will cause severe data loss!
            </p>
            <div className="grid grid-cols-1 gap-3">
                {SEGMENTS_DB.groundSegments.map(gs => {
                    const eff = gs.efficiency[m.id];
                    return (
                        <OptionCard
                            key={gs.id}
                            selected={gs.id === state.groundId}
                            onSelect={() => select('groundId', gs.id)}
                            className="p-4 border"
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
                                        Data Downlink for {m.code}: {Math.round(eff * 100)}%
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{gs.desc}</p>
                        </OptionCard>
                    );
                })}
            </div>
        </>
    );
}
