import { cmlBadgeClass } from '../../components/ui/classes';
import type { ArchitectureEval } from '../../types';

export function VerificationMatrix({ ev }: { ev: ArchitectureEval }) {
    return (
        <div className="glass-panel rounded-lg p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <span className="font-mono text-[10px] uppercase text-blue-400 block">
                        STEP 3 & 5: DEFINE REQUIREMENTS → BUILD & VERIFY
                    </span>
                    <h3 className="font-bold text-white text-sm uppercase font-mono">Requirements Verification Matrix</h3>
                </div>
                <span
                    className={`text-xs font-mono px-2.5 py-1 rounded border font-bold ${cmlBadgeClass(ev.cmlLevel)}`}
                >
                    JPL CML {ev.cmlLevel} ({ev.checksPassed}/{ev.totalChecks} OK)
                </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
                <i>
                    "When identifying requirements, also plan how you will verify that design satisfies requirements
                    prior to implementation (e.g., weighing an empty sample container &lt; 250g or volume &lt; 300mL)"
                </i>{' '}
                — Julie Levri, NASA.
            </p>

            <div className="space-y-2 text-xs font-mono">
                {ev.checks.map((r, i) => (
                    <div
                        key={r.id}
                        className={`flex items-center justify-between p-2 rounded-lg border ${
                            r.ok
                                ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                                : 'bg-red-950/30 border-red-800/60 text-red-400'
                        }`}
                    >
                        <div className="flex items-center gap-2 truncate pr-2">
                            <i
                                className={`fa-solid ${
                                    r.ok ? 'fa-circle-check text-blue-400' : 'fa-triangle-exclamation text-red-500'
                                }`}
                            />
                            <span className="truncate">
                                {i + 1}. {r.label}
                            </span>
                        </div>
                        <span className={`font-bold shrink-0 ${r.ok ? 'text-blue-300' : 'text-red-700'}`}>
                            {r.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}