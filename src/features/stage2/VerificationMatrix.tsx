import type { ArchitectureEval } from '../../types';

export function VerificationMatrix({ ev }: { ev: ArchitectureEval }) {
    const rows = [
        { label: '1. Mass Verification (Pre-launch Weighing)', val: `${ev.totalMass} / ${ev.launch.maxMass} kg`, ok: ev.massOk },
        { label: `2. Volume & Envelope Verification (${ev.m.volUnitLabel})`, val: `${ev.totalVol} / ${ev.maxAllowedVol} u`, ok: ev.volOk },
        { label: `3. Power Balance at ${ev.m.au} AU (1/R² Law)`, val: `${ev.wattsGenerated}W gen vs ${ev.wattsConsumed}W load`, ok: ev.powerOk },
        { label: '4. Instrument & Spectral Compatibility (Goals)', val: ev.payloadReqOk ? 'All Required Verified' : 'Missing / Wrong Spectrum', ok: ev.payloadReqOk },
        { label: '5. GMAT Trajectory & Delta-V Budget', val: `${ev.prop.dvProvided} km/s`, ok: ev.trajOk },
        { label: '6. Ground Segment Downlink Capacity', val: `${Math.round(ev.groundEff * 100)}% link`, ok: ev.groundOk },
        { label: '7. User Segment Lab Readiness', val: ev.userOk ? 'Aligned' : 'Mismatched Pipeline', ok: ev.userOk },
        { label: '8. NASA SMD Cost Cap Compliance', val: `$${ev.totalCost}M / $${ev.m.budgetLimit}M`, ok: ev.budgetOk },
        { label: '9. Radiation Shielding vs Environment Hazard', val: `${ev.bus.shielding}% / ${ev.m.radHazard}% req`, ok: ev.shieldOk },
        { label: '10. Launch Vehicle Orbit Compatibility', val: ev.launchOk ? 'Compatible' : 'Non-optimal Profile', ok: ev.launchOk },
    ];

    const pillClass =
        ev.cmlLevel === 4
            ? 'bg-blue-500/30 text-blue-200 border-blue-400/60'
            : 'bg-slate-700/60 text-slate-300 border-slate-600';

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
                    className={`text-xs font-mono px-2.5 py-1 rounded border font-bold ${pillClass}`}
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
                {rows.map((r, i) => (
                    <div
                        key={i}
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
                            <span className="truncate">{r.label}</span>
                        </div>
                        <span className={`font-bold shrink-0 ${r.ok ? 'text-blue-300' : 'text-red-700'}`}>
                            {r.val}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}