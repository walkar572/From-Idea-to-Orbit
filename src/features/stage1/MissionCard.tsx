import { useGame } from '../../context/GameContext';
import type { Mission } from '../../types';

interface MissionCardProps {
    mission: Mission;
    selected: boolean;
}

export function MissionCard({ mission: m, selected }: MissionCardProps) {
    const { dispatch, playTone } = useGame();
    const solarFluxPct = Math.round(100 / (m.au * m.au));

    const onClick = () => {
        playTone(760);
        dispatch({ type: 'SELECT_MISSION', missionId: m.id });
    };

    return (
        <div
            onClick={onClick}
            className={`glass-panel rounded-2xl p-5 border-2 transition cursor-pointer flex flex-col justify-between group ${
                selected
                    ? 'border-blue-500 glow-cyan bg-slate-900/95'
                    : 'border-slate-800 hover:border-blue-500/40'
            }`}
        >
            <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
                        {m.smdLabel}
                    </span>
                    <span className="font-mono text-xs text-slate-400 font-bold">{m.code}</span>
                </div>

                <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-blue-300 transition">
                        {m.name}
                    </h3>
                    <p className="font-mono text-xs text-blue-400 mt-0.5">
                        <i className="fa-solid fa-satellite mr-1" />
                        {m.orbitLabel}
                    </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1">
                    <span className="font-mono text-[10px] uppercase text-red-400 block font-bold">
                        1. MISSION NEED STATEMENT:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{m.needStatement}</p>
                </div>

                <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase text-blue-300 block font-bold">
                        2. GOALS & QUANTIFIABLE REQUIREMENTS:
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                        {m.goalsList.map((g, i) => (
                            <li key={i}>{g}</li>
                        ))}
                    </ul>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">SMD BUDGET CAP</span>
                        <span className="text-blue-400 font-bold">${m.budgetLimit}M</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">SOLAR FLUX (1/R²)</span>
                        <span className="text-slate-300 font-bold">{solarFluxPct}% ({m.au} AU)</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">VOLUME LIMIT</span>
                        <span className="text-slate-400 font-bold">≤ {m.maxVolumeUnit} units</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate-400">
                    Regime: <b className="text-slate-200">{m.wavelengthLabel}</b>
                </span>
                <button
                    className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition ${
                        selected
                            ? 'bg-blue-500 text-slate-950'
                            : 'bg-slate-800 text-white group-hover:bg-blue-500 group-hover:text-slate-950'
                    }`}
                >
                    Formulate in MDL <i className="fa-solid fa-arrow-right ml-1" />
                </button>
            </div>
        </div>
    );
}

// May our code work without bugs
