import { useGame } from '../../context/GameContext';
import { NASA_MISSIONS } from '../../data/missions';
import type { SMD } from '../../types';
import { MissionCard } from './MissionCard';

const FILTERS: { key: SMD; label: string }[] = [
    { key: 'ALL', label: 'All Missions (4)' },
    { key: 'BPS', label: 'Biological & ISS' },
    { key: 'HELIO', label: 'Heliophysics' },
    { key: 'PLANET', label: 'Planetary Science' },
];

export function Stage1() {
    const { state, dispatch, playTone } = useGame();
    const filtered =
        state.smdFilter === 'ALL'
            ? NASA_MISSIONS
            : NASA_MISSIONS.filter(m => m.smdDivision === state.smdFilter);

    const onFilter = (filter: SMD) => {
        playTone(640);
        dispatch({ type: 'SET_FILTER', filter });
    };

    return (
        <section className="space-y-5">
            <div className="glass-panel rounded-lg p-5 border border-blue-500/25 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                        <span className="w-2 h-2 rounded-full bg-blue-500 " />
                        <span>
                            NASA SYSTEMS ENGINEERING STEP 1: IDENTIFY NEED & GOALS // BEGIN WITH THE END IN MIND
                        </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                        NASA Science Mission Directorate (SMD) Formulation
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Per <b>NASA SP-2016-6105</b> and Julie Levri's webinar{' '}
                        <i>"Design and Develop Science Missions"</i>, every spaceflight project begins by defining the
                        scientific Need, quantifiable Goals, and the final product for researchers (<b>User Segment</b>
                        ). Select an authentic NASA mission concept to formulate in the <b>Mission Design Lab (MDL)</b>:
                    </p>
                </div>

                <div className="flex flex-wrap gap-1.5 bg-slate-950/90 p-2 rounded-xl border border-slate-800 shrink-0">
                    {FILTERS.map(f => (
                        <button
                            key={f.key}
                            onClick={() => onFilter(f.key)}
                            className={
                                state.smdFilter === f.key
                                    ? 'px-3 py-1.5 rounded-lg text-xs font-mono bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold'
                                    : 'px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white'
                            }
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map(m => (
                    <MissionCard key={m.id} mission={m} selected={m.id === state.missionId} />
                ))}
            </div>
        </section>
    );
}