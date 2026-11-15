import { StatCell } from '../../components/ui/StatCell';
import type { ArchitectureEval } from '../../types';

interface Props {
    ev: ArchitectureEval;
    conopsBonus: number;
    onBack: () => void;
    onNew: () => void;
}

export function DebriefCard({ ev, conopsBonus, onBack, onNew }: Props) {
    const launchScore = ev.massOk && ev.volOk && ev.launchOk ? 100 : 65;

    let spaceScore = 100;
    if (!ev.powerOk) spaceScore -= 30;
    if (!ev.payloadReqOk) spaceScore -= 35;
    if (!ev.trajOk) spaceScore -= 25;
    if (!ev.shieldOk) spaceScore -= 15;
    spaceScore = Math.max(20, Math.round(spaceScore * conopsBonus));

    const groundScore = Math.round(ev.groundEff * 100);
    const userScore = ev.userOk ? 100 : 50;

    const totalScore = Math.round(
        launchScore * 0.2 + spaceScore * 0.4 + groundScore * 0.2 + userScore * 0.2
    );
    const certified = ev.cmlLevel === 4;
    const openRequirements = ev.checks.filter(c => !c.ok).map(c => c.shortLabel);

    const verdict =
        totalScore >= 85 && certified
            ? { text: 'MISSION SUCCESS (JPL CML 4 CERTIFIED)', cls: 'text-blue-400' }
            : totalScore >= 60
            ? { text: 'PARTIAL SUCCESS (REQUIRES ITERATION)', cls: 'text-red-400' }
            : { text: 'MISSION OBJECTIVES NOT MET', cls: 'text-red-400' };

    const scoreColor = (v: number) => (v >= 85 ? 'text-blue-300' : 'text-red-400');

    return (
        <div className="glass-panel rounded-2xl p-5 border border-blue-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-blue-400 block">
                        NASA SYSTEMS ENGINEERING DEBRIEF
                    </span>
                    <h3 className={`text-lg sm:text-xl font-extrabold ${verdict.cls}`}>{verdict.text}</h3>
                    {!certified && (
                        <span className="font-mono text-[11px] text-slate-400 block mt-0.5">
                            JPL CML {ev.cmlLevel} ({ev.checksPassed}/{ev.totalChecks}) — open:{' '}
                            <span className="text-red-400">{openRequirements.join(', ')}</span>
                        </span>
                    )}
                </div>
                <div className="text-right">
                    <span className="font-mono text-[10px] text-slate-400 block">OVERALL SCORE</span>
                    <span className="font-mono text-2xl font-extrabold text-white">{totalScore}%</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <StatCell inline label="1. Launch Seg:" value={`${launchScore}%`} valueClassName={scoreColor(launchScore)} />
                <StatCell inline label="2. Space Seg:" value={`${spaceScore}%`} valueClassName={scoreColor(spaceScore)} />
                <StatCell inline label="3. Ground Seg:" value={`${groundScore}%`} valueClassName={scoreColor(groundScore)} />
                <StatCell inline label="4. User Seg:" value={`${userScore}%`} valueClassName={scoreColor(userScore)} />
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/50 border border-blue-500/30 space-y-1.5 text-xs">
                <div className="font-mono font-bold text-blue-300 flex items-center gap-1.5">
                    <i className="fa-solid fa-award" />
                    <span>REAL NASA FLEET BENCHMARK:</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">{ev.m.realComparison}</p>
            </div>

            <div className="flex gap-2 pt-1">
                <button
                    onClick={onBack}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs uppercase transition border border-slate-700"
                >
                    <i className="fa-solid fa-sliders mr-1" />
                    Back to MDL Lab
                </button>
                <button
                    onClick={onNew}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-mono font-bold text-xs uppercase transition"
                >
                    <i className="fa-solid fa-rotate mr-1" />
                    New Mission
                </button>
            </div>
        </div>
    );
}
