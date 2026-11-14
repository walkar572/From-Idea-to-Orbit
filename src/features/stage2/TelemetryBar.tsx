import { useGame } from '../../context/GameContext';
import { getLaunchHold } from '../../engine/systemsEngineering';
import type { ArchitectureEval } from '../../types';

interface Props {
    ev: ArchitectureEval;
}

export function TelemetryBar({ ev }: Props) {
    const { dispatch, playTone, showToast } = useGame();
    const m = ev.m;

    const fluxPct = Math.round(100 / (m.au * m.au));

    const onMDLAuto = () => {
        playTone(920, '16n');
        dispatch({ type: 'APPLY_MDL_PRESET' });
        showToast(`Loaded verified MDL Point Design (JPL CML 4) baseline for ${m.code}!`);
    };

    const onOfficeHours = () => {
        playTone(780, '16n');
        showToast(`NASA MDL Office Hours Advisory: ${m.officeHoursHint}`);
    };

    const onStartSim = () => {
        const hold = getLaunchHold(ev);
        if (hold) {
            playTone(220, '8n');
            showToast(hold);
            return;
        }
        playTone(600);
        dispatch({ type: 'START_SIM' });
    };

    const costPct = Math.min(100, Math.round((ev.totalCost / m.budgetLimit) * 100));
    const massPct = Math.min(100, Math.round((ev.totalMass / ev.launch.maxMass) * 100));
    const volPct = Math.min(100, Math.round((ev.totalVol / ev.maxAllowedVol) * 100));
    const pwrPct =
        ev.wattsGenerated > 0 ? Math.min(100, Math.round((ev.wattsConsumed / ev.wattsGenerated) * 100)) : 100;

    return (
        <div
            data-telemetry-bar
            className="relative xl:sticky xl:top-[calc(var(--header-h,110px)_+_8px)] z-30 glass-panel rounded-2xl p-3.5 border border-blue-500/35 shadow-2xl"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-center">
                <div className="flex items-center justify-between gap-2 border-b sm:border-b-0 sm:border-r border-slate-800 pb-2 sm:pb-0 sm:pr-3">
                    <div className="min-w-0">
                        <span className="font-mono text-[10px] uppercase text-blue-400 block">
                            {m.code} // {m.smdDivision}
                        </span>
                        <div className="font-bold text-white text-xs sm:text-sm truncate">{m.name}</div>
                        <span className="font-mono text-[11px] text-slate-400">
                            {m.au} AU | Solar Flux: {fluxPct}%
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                        <button
                            onClick={onMDLAuto}
                            className="px-2 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 text-[10px] font-mono font-bold transition"
                            title="Load Verified MDL Point Design Configuration"
                        >
                            <i className="fa-solid fa-wand-magic-sparkles mr-1" />
                            MDL Auto
                        </button>
                        <button
                            onClick={onOfficeHours}
                            className="px-2 py-1 rounded bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 text-slate-300 text-[10px] font-mono transition"
                            title="Consult NASA MDL Lead Engineers"
                        >
                            <i className="fa-solid fa-user-astronaut mr-1" />
                            Office Hours
                        </button>
                    </div>
                </div>

                <BarCell
                    label="PROJECT BUDGET"
                    val={`$${ev.totalCost}M / $${m.budgetLimit}M`}
                    fill={costPct}
                    ok={ev.budgetOk}
                    color="emerald"
                    sub={
                        ev.budgetOk
                            ? `Margin: $${m.budgetLimit - ev.totalCost}M`
                            : `Over Budget: +$${ev.totalCost - m.budgetLimit}M!`
                    }
                />
                <BarCell
                    label="MASS (SPACE SEG)"
                    val={`${ev.totalMass} / ${ev.launch.maxMass} kg`}
                    fill={massPct}
                    ok={ev.massOk}
                    color="cyan"
                    sub={
                        ev.massOk
                            ? `Margin: +${(ev.launch.maxMass - ev.totalMass).toFixed(1)} kg`
                            : 'Launch Vehicle Overweight!'
                    }
                />
                <BarCell
                    label="PAYLOAD VOLUME"
                    val={`${ev.totalVol} / ${ev.maxAllowedVol} units`}
                    fill={volPct}
                    ok={ev.volOk}
                    color="purple"
                    sub={ev.volOk ? `Envelope OK (${m.volUnitLabel.split(' ')[0]})` : 'Volume Limit Exceeded!'}
                />
                <BarCell
                    label="ORBITAL POWER"
                    val={`${ev.wattsConsumed}W / ${ev.wattsGenerated}W`}
                    fill={pwrPct}
                    ok={ev.powerOk}
                    color="amber"
                    sub={
                        ev.powerOk
                            ? `Reserve: +${ev.wattsGenerated - ev.wattsConsumed}W at ${m.au} AU`
                            : `Power Deficit at ${m.au} AU!`
                    }
                />

                <div>
                    <button
                        onClick={onStartSim}
                        className="w-full py-2.5 px-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-slate-950 shadow-lg shadow-blue-500/20"
                    >
                        <i className="fa-solid fa-rocket" />
                        <span>GMAT Simulation</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function BarCell({
    label,
    val,
    fill,
    ok,
    color,
    sub,
}: {
    label: string;
    val: string;
    fill: number;
    ok: boolean;
    color: 'emerald' | 'cyan' | 'purple' | 'amber';
    sub: string;
}) {
    const fillColor = !ok
        ? 'bg-red-700'
        : color === 'emerald'
        ? 'bg-blue-500'
        : color === 'cyan'
        ? 'bg-blue-500'
        : color === 'purple'
        ? 'bg-slate-500'
        : 'bg-blue-500';
    const subColor = !ok
        ? 'text-red-700 font-bold'
        : color === 'emerald'
        ? 'text-blue-400'
        : color === 'cyan'
        ? 'text-blue-300'
        : color === 'purple'
        ? 'text-slate-400'
        : 'text-slate-300';

    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">{label}</span>
                <span className="font-bold text-white">{val}</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className={`h-full ${fillColor} transition-all`} style={{ width: `${fill}%` }} />
            </div>
            <span className={`text-[10px] font-mono block ${subColor}`}>{sub}</span>
        </div>
    );
}