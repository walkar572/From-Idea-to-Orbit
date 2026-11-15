import { useGame } from '../../../context/GameContext';
import { SEGMENTS_DB } from '../../../data/modules';
import { effectiveWatts } from '../../../engine/systemsEngineering';
import type { ArchitectureEval } from '../../../types';

export function SpacePanel({ ev }: { ev: ArchitectureEval }) {
    const { state, dispatch, playTone } = useGame();
    const m = ev.m;

    const setChoice = (action: 'SET_PROPULSION' | 'SET_POWER' | 'SET_BUS', id: string) => {
        playTone(680);
        dispatch({ type: action, id });
    };

    const togglePayload = (id: string) => {
        playTone(720);
        dispatch({ type: 'TOGGLE_PAYLOAD', id });
    };

    return (
        <>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                    <span className="font-mono text-[10px] uppercase text-blue-400 block">
                        SEGMENT 2 OF 4 // SPACE SEGMENT & MDL DISCIPLINES
                    </span>
                    <h3 className="text-base font-bold text-white">
                        Propulsion (GMAT), Power, Structure & Scientific Instruments
                    </h3>
                </div>
                <span className="font-mono text-xs text-red-400">Distance: {m.au} AU</span>
            </div>
            <div className="space-y-2">
                <label className="font-mono text-xs font-bold text-blue-300 uppercase block">
                    2A. GMAT Trajectory & Propulsion Subsystem:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SEGMENTS_DB.propulsionOptions.map(pr => {
                        const active = pr.id === state.propulsionId;
                        const match = pr.bestFor.includes(m.id);
                        return (
                            <button
                                type="button"
                                key={pr.id}
                                aria-pressed={active}
                                onClick={() => setChoice('SET_PROPULSION', pr.id)}
                                className={`w-full text-left p-3 rounded-xl border-2 transition cursor-pointer ${
                                    active
                                        ? 'border-blue-500 bg-blue-950/40'
                                        : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-white text-xs">{pr.name}</span>
                                    <span className="font-mono text-[11px] text-blue-300">
                                        {pr.dvProvided} km/s
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">{pr.desc}</p>
                                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/80 font-mono text-[10px]">
                                    <span className="text-blue-400">
                                        ${pr.cost}M | {pr.mass} kg
                                    </span>
                                    <span className={match ? 'text-blue-300' : 'text-red-400'}>
                                        {match ? '★ Optimal Trajectory' : 'Sub-optimal Delta-V'}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="font-mono text-xs font-bold text-red-400 uppercase block">
                    2B. Electrical Power Subsystem (Inverse-Square 1 / AU² at {m.au} AU):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SEGMENTS_DB.powerOptions.map(pw => {
                        const active = pw.id === state.powerId;
                        const actualW = effectiveWatts(pw, m);
                        const issOnly = pw.type === 'station' && !m.issHosted;
                        return (
                            <button
                                type="button"
                                key={pw.id}
                                aria-pressed={active}
                                onClick={() => setChoice('SET_POWER', pw.id)}
                                className={`w-full text-left p-3 rounded-xl border-2 transition cursor-pointer ${
                                    active
                                        ? 'border-blue-500 bg-blue-950/40'
                                        : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-white text-xs">{pw.name}</span>
                                    <span
                                        className={`font-mono text-[11px] px-1.5 py-0.5 rounded font-bold ${
                                            actualW >= ev.wattsConsumed
                                                ? 'bg-blue-500/15 text-blue-300'
                                                : 'bg-red-700/15 text-red-400'
                                        }`}
                                        title={
                                            issOnly
                                                ? 'Station power is only available to ISS-hosted payloads'
                                                : `Current load: ${ev.wattsConsumed}W`
                                        }
                                    >
                                        {issOnly ? 'ISS only' : `+${actualW}W`}
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">{pw.desc}</p>
                                <div className="flex justify-between mt-2 pt-1.5 border-t border-slate-800/80 font-mono text-[10px] text-slate-300">
                                    <span className="text-blue-400">${pw.cost}M</span>
                                    <span>Mass: {pw.mass} kg</span>
                                    <span>At 1 AU: {pw.baseWatts}W</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="font-mono text-xs font-bold text-slate-400 uppercase block">
                    2C. Spacecraft Bus, Volume & Radiation Shielding (Target Hazard: {m.radHazard}%):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SEGMENTS_DB.busOptions.map(b => {
                        const active = b.id === state.busId;
                        return (
                            <button
                                type="button"
                                key={b.id}
                                aria-pressed={active}
                                onClick={() => setChoice('SET_BUS', b.id)}
                                className={`w-full text-left p-3 rounded-xl border-2 transition cursor-pointer ${
                                    active
                                        ? 'border-blue-500 bg-blue-950/40'
                                        : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-white text-xs">{b.name}</span>
                                    <span
                                        className={`font-mono text-[11px] ${
                                            b.shielding >= m.radHazard ? 'text-blue-300' : 'text-red-300'
                                        } font-bold`}
                                    >
                                        Shield {b.shielding}%
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">{b.desc}</p>
                                <div className="flex justify-between mt-2 pt-1.5 border-t border-slate-800/80 font-mono text-[10px] text-slate-300">
                                    <span className="text-blue-400">${b.cost}M</span>
                                    <span>{b.mass} kg</span>
                                    <span className="text-slate-400">Vol: {b.volUsed} u</span>
                                    <span className="text-slate-300">-{b.powerDraw}W</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                    <label className="font-mono text-xs font-bold text-blue-300 uppercase">
                        2D. Scientific Instruments & Payload Hardware (Spectral Compatibility):
                    </label>
                    <span className="font-mono text-[11px] text-blue-300">Required: {m.wavelengthReq}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {SEGMENTS_DB.payloads.map(pl => {
                        const selected = state.payloads.includes(pl.id);
                        const isReq = m.requiredPayloads.includes(pl.id);
                        const isCompatible = pl.tag === m.wavelengthReq;
                        return (
                            <button
                                type="button"
                                key={pl.id}
                                aria-pressed={selected}
                                onClick={() => togglePayload(pl.id)}
                                className={`w-full h-full text-left p-3 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                                    selected
                                        ? 'border-blue-500 bg-blue-950/40 glow-cyan'
                                        : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                                }`}
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="font-bold text-white text-xs">
                                            <i className={`fa-solid ${pl.icon} text-blue-400 mr-1.5`} />
                                            {pl.name}
                                        </span>
                                        <i
                                            aria-hidden="true"
                                            className={`mt-0.5 ${
                                                selected
                                                    ? 'fa-solid fa-square-check text-blue-400'
                                                    : 'fa-regular fa-square text-slate-500'
                                            }`}
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {isReq && (
                                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-red-700/15 text-red-400 border border-red-500/30 font-bold">
                                                ★ Primary Mission Requirement
                                            </span>
                                        )}
                                        <span
                                            className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                                                isCompatible
                                                    ? 'bg-blue-500/15 text-blue-300'
                                                    : 'bg-red-700/20 text-red-300'
                                            }`}
                                        >
                                            {isCompatible ? 'Compatible Spectrum' : 'Incompatible Wavelength!'}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-1.5">{pl.desc}</p>
                                </div>
                                <div className="flex justify-between mt-2.5 pt-1.5 border-t border-slate-800 font-mono text-[10px]">
                                    <span className="text-blue-400">${pl.cost}M</span>
                                    <span className="text-blue-300">{pl.mass} kg</span>
                                    <span className="text-slate-400">{pl.vol} u</span>
                                    <span className="text-slate-300">-{pl.power}W</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}