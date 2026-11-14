import { useGame } from '../../../context/GameContext';
import { SEGMENTS_DB } from '../../../data/modules';
import type { ArchitectureEval } from '../../../types';

export function UserPanel({ ev }: { ev: ArchitectureEval }) {
    const { state, dispatch, playTone } = useGame();
    const m = ev.m;

    return (
        <>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                    <span className="font-mono text-[10px] uppercase text-blue-400 block">
                        SEGMENT 4 OF 4 // USER SEGMENT ("BEGIN WITH THE END IN MIND", PAGES 15 & 18)
                    </span>
                    <h3 className="text-base font-bold text-white">
                        Sample Processing, Scientific Analysis & Peer-Reviewed Publication
                    </h3>
                </div>
                <span className="font-mono text-xs text-slate-400">End Science Product</span>
            </div>
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
                    const active = us.id === state.userId;
                    const isBest = us.bestFor === m.id;
                    return (
                        <div
                            key={us.id}
                            onClick={() => {
                                playTone(680);
                                dispatch({ type: 'SET_USER', id: us.id });
                            }}
                            className={`p-4 rounded-xl border transition cursor-pointer ${
                                active
                                    ? 'border-blue-500 bg-blue-950/40 glow-cyan'
                                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                            }`}
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
                        </div>
                    );
                })}
            </div>
        </>
    );
}