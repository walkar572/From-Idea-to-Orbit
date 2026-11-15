import { toggleClass } from '../../components/ui/classes';
import { useGame } from '../../context/GameContext';
import type { SegmentTab } from '../../types';

const TABS: { key: SegmentTab; num: number; title: string; sub: string; icon: string }[] = [
    { key: 'launch', num: 1, title: 'LAUNCH', sub: 'Vehicle & Stowage', icon: 'fa-shuttle-space' },
    { key: 'space', num: 2, title: 'SPACE', sub: 'Bus, Power & Payloads', icon: 'fa-satellite' },
    { key: 'ground', num: 3, title: 'GROUND', sub: 'DSN & Mission Ops', icon: 'fa-tower-cell' },
    { key: 'user', num: 4, title: 'USER', sub: 'Science & Publication', icon: 'fa-flask-vial' },
];

export function SegmentTabs() {
    const { state, dispatch, playTone } = useGame();

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/90 p-1.5 rounded-lg border border-slate-800">
            {TABS.map(t => {
                const active = state.activeSegmentTab === t.key;
                return (
                    <button
                        key={t.key}
                        onClick={() => {
                            playTone(580);
                            dispatch({ type: 'SET_SEGMENT_TAB', tab: t.key });
                        }}
                        className={`p-2.5 rounded-xl text-left transition ${toggleClass(active)}`}
                    >
                        <div className="flex items-center justify-between text-xs font-mono font-bold">
                            <span>
                                {t.num}. {t.title}
                            </span>
                            <i className={`fa-solid ${t.icon}`} />
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{t.sub}</span>
                    </button>
                );
            })}
        </div>
    );
}