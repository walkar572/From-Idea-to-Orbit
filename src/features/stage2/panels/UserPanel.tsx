import { OptionCard } from '../../../components/ui/OptionCard';
import { useGame } from '../../../context/GameContext';
import { SEGMENTS_DB } from '../../../data/modules';
import type { ArchitectureEval } from '../../../types';
import { SegmentPanelHeader } from './SegmentPanelHeader';
import { useSegmentSelect } from './useSegmentSelect';

export function UserPanel({ ev }: { ev: ArchitectureEval }) {
    const { state } = useGame();
    const select = useSegmentSelect();
    const m = ev.m;

    return (
        <>
            <SegmentPanelHeader
                kicker={'SEGMENT 4 OF 4 // USER SEGMENT ("BEGIN WITH THE END IN MIND", PAGES 15 & 18)'}
                title="Sample Processing, Scientific Analysis & Peer-Reviewed Publication"
                aside="End Science Product"
                asideClassName="text-slate-400"
            />
            <p className="text-xs text-slate-300">
                As highlighted on Pages 15 and 18 of Julie Levri's NASA presentation:{' '}
                <i>
                    "Begin with the End in Mind — information/data, in the form of a publication, is part of the end
                    product."
                </i>{' '}
                Select the <b>User Segment</b> analysis pipeline tailored to your mission:
            </p>
            <div className="grid grid-cols-1 gap-3">
                {SEGMENTS_DB.userSegments.map(us => {
                    const isBest = us.bestFor === m.id;
                    return (
                        <OptionCard
                            key={us.id}
                            selected={us.id === state.userId}
                            onSelect={() => select('userId', us.id)}
                            className="p-4 border"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-bold text-white text-sm">{us.name}</span>
                                <div className="flex items-center gap-2 font-mono text-xs">
                                    <span className="text-blue-400 font-bold">${us.cost}M</span>
                                    <span
                                        className={`px-2 py-0.5 rounded ${
                                            isBest
                                                ? 'bg-blue-500/20 text-blue-300 font-bold'
                                                : 'bg-slate-800 text-slate-400'
                                        }`}
                                    >
                                        {isBest ? '★ Matched User Pipeline' : 'Mismatched Discipline'}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{us.desc}</p>
                        </OptionCard>
                    );
                })}
            </div>
        </>
    );
}
