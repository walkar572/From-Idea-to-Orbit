import type { ArchitectureEval } from '../../types';

export function CadBlueprint({ ev }: { ev: ArchitectureEval }) {
    const { m } = ev;

    let svg: JSX.Element;
    if (m.id === 'bionutrients') {
        svg = (
            <svg viewBox="0 0 380 200" className="w-full max-w-[380px] h-auto ">
                <rect x="20" y="20" width="340" height="160" rx="12" fill="rgba(15,23,42,0.85)" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6,4" />
                <text x="35" y="40" fill="#38bdf8" fontFamily="JetBrains Mono" fontSize="10">ISS INCUBATOR (+30°C) & MELFI FREEZER (-80°C)</text>
                <rect x="65" y="60" width="185" height="90" rx="8" fill="rgba(255, 184, 0, 0.18)" stroke="#ffb800" strokeWidth="3" />
                <rect x="75" y="70" width="165" height="70" rx="4" fill="rgba(255, 184, 0, 0.28)" stroke="#fde047" strokeWidth="1.5" />
                <rect x="250" y="75" width="48" height="16" rx="3" fill="#cbd5e1" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="298" cy="83" r="6" fill="#00e676" />
                <text x="255" y="68" fill="#94a3b8" fontFamily="JetBrains Mono" fontSize="9">Luer-Lok Port</text>
                <rect x="215" y="112" width="18" height="24" rx="2" fill="#00e676" />
                <circle cx="145" cy="105" r="14" fill="rgba(255,184,0,0.4)" stroke="#ffb800" strokeWidth="1.5" />
                <text x="145" y="109" textAnchor="middle" fill="#ffffff" fontFamily="JetBrains Mono" fontSize="9">Yeast 30mL</text>
                <text x="75" y="166" fill="#00f0ff" fontFamily="JetBrains Mono" fontSize="10">P/N 110596-002 | FEP 3mil | Vol: {ev.totalVol}/300 mL</text>
            </svg>
        );
    } else if (m.id === 'punch') {
        const sats = [
            { x: 190, y: 22, label: 'NFI-1' },
            { x: 300, y: 100, label: 'WFI-2' },
            { x: 190, y: 178, label: 'WFI-3' },
            { x: 80, y: 100, label: 'WFI-4' },
        ];
        svg = (
            <svg viewBox="0 0 380 200" className="w-full max-w-[380px] h-auto ">
                <circle cx="190" cy="100" r="78" fill="none" stroke="rgba(0,240,255,0.2)" strokeWidth="1.5" strokeDasharray="4,4" />
                <circle cx="190" cy="100" r="24" fill="#ffb800" className="" />
                <text x="190" y="104" textAnchor="middle" fill="#050811" fontFamily="JetBrains Mono" fontSize="9" fontWeight="bold">SUN</text>
                {sats.map((sat, i) => (
                    <g key={i}>
                        <rect x={sat.x - 36} y={sat.y - 8} width="22" height="16" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                        <rect x={sat.x + 14} y={sat.y - 8} width="22" height="16" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                        <rect x={sat.x - 12} y={sat.y - 11} width="24" height="22" rx="3" fill="#0f172a" stroke="#00f0ff" strokeWidth="2" />
                        <text x={sat.x} y={sat.y + 3} textAnchor="middle" fill="#fff" fontFamily="JetBrains Mono" fontSize="7">{sat.label}</text>
                    </g>
                ))}
            </svg>
        );
    } else {
        const isRtg = ev.power.id === 'rtg_mmrtg';
        const hasRadar = ev.selectedPayloadObjs.some(p => p.id === 'ice_radar_reason');
        const vaultStroke = ev.bus.id === 'bus_titanium_vault' ? '#f59e0b' : '#00f0ff';
        svg = (
            <svg viewBox="0 0 380 200" className="w-full max-w-[380px] h-auto ">
                {isRtg ? (
                    <>
                        <rect x="68" y="84" width="60" height="32" rx="4" fill="#334155" stroke="#f59e0b" strokeWidth="2" />
                        <circle cx="88" cy="100" r="8" fill="#f59e0b" />
                        <rect x="252" y="84" width="60" height="32" rx="4" fill="#334155" stroke="#f59e0b" strokeWidth="2" />
                        <circle cx="292" cy="100" r="8" fill="#f59e0b" />
                    </>
                ) : (
                    <>
                        <rect x="8" y="70" width="122" height="60" rx="4" fill="#0369a1" stroke="#00f0ff" strokeWidth="2" />
                        <line x1="48" y1="70" x2="48" y2="130" stroke="#38bdf8" strokeWidth="1" />
                        <line x1="88" y1="70" x2="88" y2="130" stroke="#38bdf8" strokeWidth="1" />
                        <rect x="250" y="70" width="122" height="60" rx="4" fill="#0369a1" stroke="#00f0ff" strokeWidth="2" />
                        <line x1="290" y1="70" x2="290" y2="130" stroke="#38bdf8" strokeWidth="1" />
                        <line x1="330" y1="70" x2="330" y2="130" stroke="#38bdf8" strokeWidth="1" />
                    </>
                )}
                <path d="M 135 52 Q 190 88 245 52" fill="rgba(0,240,255,0.15)" stroke="#00f0ff" strokeWidth="3.5" />
                <line x1="190" y1="68" x2="190" y2="22" stroke="#00f0ff" strokeWidth="2.5" />
                <circle cx="190" cy="20" r="5" fill="#ffb800" />
                {hasRadar && (
                    <>
                        <line x1="95" y1="158" x2="285" y2="158" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="6,3" />
                        <circle cx="95" cy="158" r="4" fill="#a855f7" />
                        <circle cx="285" cy="158" r="4" fill="#a855f7" />
                    </>
                )}
                <rect x="138" y="66" width="104" height="74" rx="9" fill="#0f172a" stroke={vaultStroke} strokeWidth="3.5" />
                <text x="190" y="106" textAnchor="middle" fill="#ffffff" fontFamily="JetBrains Mono" fontSize="10" fontWeight="bold">{m.code}</text>
                <polygon points="172,140 208,140 216,172 164,172" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                <ellipse cx="190" cy="178" rx="14" ry="6" fill="rgba(0,240,255,0.55)" />
            </svg>
        );
    }

    return (
        <div className="glass-panel rounded-lg p-4 border border-blue-500/30 blueprint-grid flex flex-col justify-between min-h-[320px]">
            <div className="flex items-center justify-between">
                <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-blue-400 block">
                        MDL POINT DESIGN CAD // 4-SEGMENT ARCHITECTURE
                    </span>
                    <h3 className="font-bold text-white text-sm sm:text-base">Space Segment & Payload Schematic</h3>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-slate-900 text-blue-300 border border-blue-500/30">
                    {m.wavelengthLabel}
                </span>
            </div>

            <div className="my-auto py-3 flex items-center justify-center">{svg}</div>

            <div className="grid grid-cols-4 gap-1.5 pt-2.5 border-t border-slate-700 text-[10px] font-mono">
                <MiniCell label="LAUNCH SEG" val={ev.launch.name.split(' ')[0]} color="text-blue-300" />
                <MiniCell label="SPACE SEG" val={`${ev.bus.name.split(' ')[0]} + ${ev.selectedPayloadObjs.length} inst.`} color="text-blue-300" />
                <MiniCell label="GROUND SEG" val={ev.ground.name.split(' ')[0]} color="text-red-400" />
                <MiniCell label="USER SEG" val={ev.user.name.split(':')[0]} color="text-slate-400" />
            </div>
        </div>
    );
}

function MiniCell({ label, val, color }: { label: string; val: string; color: string }) {
    return (
        <div className="bg-slate-950/85 p-2 rounded border border-slate-800">
            <span className="text-slate-500 block">{label}</span>
            <span className={`${color} font-bold truncate block`}>{val}</span>
        </div>
    );
}