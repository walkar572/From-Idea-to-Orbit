import { NASA_MISSIONS } from '../data/missions';
import { SEGMENTS_DB } from '../data/modules';
import type {
    ArchitectureEval,
    CmlLevel,
    GameState,
    Mission,
    MissionConfig,
    MissionId,
    Payload,
    PowerOption,
    VerificationCheck,
} from '../types';

export const GROUND_EFF_MIN = 0.9;
export const CML3_MIN_CHECKS = 5;
export const SOLAR_CONSTANT_WM2 = 1361;

export const CML_LABELS: Record<CmlLevel, { cml: string; mdl: string }> = {
    1: { cml: 'JPL CML 1: Initial Idea', mdl: 'MDL: Office Hours' },
    2: { cml: 'JPL CML 2: Feasibility Concept', mdl: 'MDL: Concept Development' },
    3: { cml: 'JPL CML 3: Trade Space Explored', mdl: 'MDL: Trade Studies' },
    4: { cml: 'JPL CML 4: Point Design Verified', mdl: 'MDL: Point Design Ready' },
};

const inverseSquare = (au: number) => 1 / (au * au);

export function solarFluxPct(au: number): number {
    return Math.round(100 * inverseSquare(au));
}

export function solarFluxWm2(au: number): number {
    return Math.round(SOLAR_CONSTANT_WM2 * inverseSquare(au));
}

export function effectiveWatts(power: PowerOption, m: Mission): number {
    switch (power.type) {
        case 'solar':
            return Math.round(power.baseWatts * inverseSquare(m.au));
        case 'station':
            return m.issHosted ? power.baseWatts : 0;
        case 'nuclear':
            return power.baseWatts;
    }
}

export function getMission(missionId: MissionId): Mission {
    const m = NASA_MISSIONS.find(x => x.id === missionId);
    if (!m) throw new Error(`Unknown mission: ${missionId}`);
    return m;
}

export function getPresetConfig(missionId: MissionId): MissionConfig {
    const preset = getMission(missionId).optimalPreset;
    return { ...preset, missionId, payloads: [...preset.payloads] };
}

export function toMissionConfig(state: GameState): MissionConfig {
    const { missionId, launchId, propulsionId, powerId, busId, payloads, groundId, userId } = state;
    return { missionId, launchId, propulsionId, powerId, busId, payloads: [...payloads], groundId, userId };
}

function findById<T extends { id: string }>(items: T[], id: string, kind: string): T {
    const item = items.find(x => x.id === id);
    if (!item) throw new Error(`Invalid architecture: unknown ${kind} "${id}".`);
    return item;
}

function sumOf(payloads: Payload[], key: 'cost' | 'mass' | 'vol' | 'power'): number {
    return payloads.reduce((s, p) => s + p[key], 0);
}

export function evaluateArchitecture(config: MissionConfig): ArchitectureEval {
    const m = getMission(config.missionId);
    const launch = findById(SEGMENTS_DB.launchVehicles, config.launchId, 'launch vehicle');
    const prop = findById(SEGMENTS_DB.propulsionOptions, config.propulsionId, 'propulsion');
    const power = findById(SEGMENTS_DB.powerOptions, config.powerId, 'power option');
    const bus = findById(SEGMENTS_DB.busOptions, config.busId, 'bus');
    const ground = findById(SEGMENTS_DB.groundSegments, config.groundId, 'ground segment');
    const user = findById(SEGMENTS_DB.userSegments, config.userId, 'user segment');
    const selectedPayloadObjs = SEGMENTS_DB.payloads.filter(p => config.payloads.includes(p.id));

    const totalCost =
        launch.cost + prop.cost + power.cost + bus.cost + sumOf(selectedPayloadObjs, 'cost') + ground.cost + user.cost;
    const budgetOk = totalCost <= m.budgetLimit;
    const totalMass = +(prop.mass + power.mass + bus.mass + sumOf(selectedPayloadObjs, 'mass')).toFixed(1);
    const massOk = totalMass <= launch.maxMass;
    const totalVol = bus.volUsed + sumOf(selectedPayloadObjs, 'vol');
    const maxAllowedVol = m.maxVolumeUnit + launch.maxVolBonus;
    const volOk = totalVol <= maxAllowedVol;
    const wattsGenerated = effectiveWatts(power, m);
    const wattsConsumed = bus.powerDraw + sumOf(selectedPayloadObjs, 'power');
    const powerOk = wattsGenerated >= wattsConsumed;
    const missingReqPayloads = m.requiredPayloads.filter(reqId => !config.payloads.includes(reqId));
    const incompatiblePayloads = selectedPayloadObjs.filter(p => p.tag !== m.wavelengthReq);
    const payloadReqOk = missingReqPayloads.length === 0 && incompatiblePayloads.length === 0;
    const launchOk = launch.allowedMissions.includes(m.id);
    const trajOk = prop.bestFor.includes(m.id);
    const groundEff = ground.efficiency[m.id];
    const groundOk = groundEff >= GROUND_EFF_MIN;
    const userOk = user.bestFor === m.id;
    const shieldOk = bus.shielding >= m.radHazard;

    const checks: VerificationCheck[] = [
        {
            id: 'mass',
            label: 'Mass Verification (Pre-launch Weighing)',
            shortLabel: 'Mass',
            value: `${totalMass} / ${launch.maxMass} kg`,
            ok: massOk,
        },
        {
            id: 'volume',
            label: `Volume & Envelope Verification (${m.volUnitLabel})`,
            shortLabel: 'Volume',
            value: `${totalVol} / ${maxAllowedVol} u`,
            ok: volOk,
        },
        {
            id: 'power',
            label: `Power Balance at ${m.au} AU (1/R² Law)`,
            shortLabel: 'Power Balance',
            value: `${wattsGenerated}W gen vs ${wattsConsumed}W load`,
            ok: powerOk,
        },
        {
            id: 'instruments',
            label: 'Instrument & Spectral Compatibility (Goals)',
            shortLabel: 'Instruments',
            value: payloadReqOk ? 'All Required Verified' : 'Missing / Wrong Spectrum',
            ok: payloadReqOk,
        },
        {
            id: 'trajectory',
            label: 'GMAT Trajectory & Delta-V Budget',
            shortLabel: 'Trajectory',
            value: `${prop.dvProvided} km/s`,
            ok: trajOk,
        },
        {
            id: 'ground',
            label: 'Ground Segment Downlink Capacity',
            shortLabel: 'Ground Downlink',
            value: `${Math.round(groundEff * 100)}% link`,
            ok: groundOk,
        },
        {
            id: 'user',
            label: 'User Segment Lab Readiness',
            shortLabel: 'User Pipeline',
            value: userOk ? 'Aligned' : 'Mismatched Pipeline',
            ok: userOk,
        },
        {
            id: 'budget',
            label: 'NASA SMD Cost Cap Compliance',
            shortLabel: 'Cost Cap',
            value: `$${totalCost}M / $${m.budgetLimit}M`,
            ok: budgetOk,
        },
        {
            id: 'shielding',
            label: 'Radiation Shielding vs Environment Hazard',
            shortLabel: 'Radiation Shielding',
            value: `${bus.shielding}% / ${m.radHazard}% req`,
            ok: shieldOk,
        },
        {
            id: 'launch',
            label: 'Launch Vehicle Orbit Compatibility',
            shortLabel: 'Launch Vehicle',
            value: launchOk ? 'Compatible' : 'Non-optimal Profile',
            ok: launchOk,
        },
    ];
    const totalChecks = checks.length;
    const checksPassed = checks.filter(c => c.ok).length;
    const cmlLevel = checksPassed === totalChecks ? 4 : checksPassed >= CML3_MIN_CHECKS ? 3 : 2;

    return {
        m, launch, prop, power, bus, ground, user, selectedPayloadObjs,
        totalCost, budgetOk,
        totalMass, massOk,
        totalVol, maxAllowedVol, volOk,
        wattsGenerated, wattsConsumed, powerOk,
        missingReqPayloads, incompatiblePayloads, payloadReqOk,
        launchOk, trajOk, groundEff, groundOk, userOk, shieldOk,
        checks, checksPassed, totalChecks, cmlLevel,
    };
}

export function getLaunchHold(ev: ArchitectureEval): string | null {
    if (!ev.budgetOk) {
        return 'Verification Hold: Mission budget cap exceeded! Optimize segments or click "MDL Auto".';
    }
    if (!ev.massOk || !ev.volOk) {
        return 'Verification Hold: Spacecraft mass or volume exceeds launch vehicle envelope!';
    }
    return null;
}

export const CONOPS_FAILED_YIELD = 0.75;

export interface ConopsOutcome {
    scienceYield: number;
    severity: 'ok' | 'warn' | 'err';
    message: string;
}

function checkConopsRequirement(ev: ArchitectureEval): { ok: boolean; detail: string } {
    const req = ev.m.conopsEvent.opt1Requires;
    switch (req.kind) {
        case 'shielding':
            return ev.shieldOk
                ? { ok: true, detail: `Bus shielding (${ev.bus.shielding}%) protected all payloads` }
                : {
                      ok: false,
                      detail: `Insufficient shielding (${ev.bus.shielding}% < ${ev.m.radHazard}%) caused partial sample/sensor degradation (-${ev.m.radHazard - ev.bus.shielding}%)`,
                  };
        case 'payload': {
            const name = SEGMENTS_DB.payloads.find(p => p.id === req.id)?.name ?? req.id;
            return ev.selectedPayloadObjs.some(p => p.id === req.id)
                ? { ok: true, detail: `${name} supported the directive` }
                : { ok: false, detail: `${name} is not on board, so the directive was only partially executed` };
        }
        case 'propulsion': {
            const name = SEGMENTS_DB.propulsionOptions.find(p => p.id === req.id)?.name ?? req.id;
            return ev.prop.id === req.id
                ? { ok: true, detail: `${name} supported the directive` }
                : {
                      ok: false,
                      detail: `${name} is not installed (flying ${ev.prop.name}), so the directive was only partially executed`,
                  };
        }
    }
}

export function resolveConopsDirective(ev: ArchitectureEval, option: 1 | 2): ConopsOutcome {
    if (option === 2) {
        const y = ev.m.conopsEvent.opt2Yield;
        return {
            scienceYield: y,
            severity: 'warn',
            message: `[DIRECTIVE EXECUTED] Conservative Protocol B completed. Hardware preserved at 100%, science data volume at ${Math.round(y * 100)}%.`,
        };
    }
    const { ok, detail } = checkConopsRequirement(ev);
    return ok
        ? {
              scienceYield: 1,
              severity: 'ok',
              message: `[DIRECTIVE EXECUTED] Nominal Protocol A completed. ${detail}; 100% science yield achieved!`,
          }
        : {
              scienceYield: CONOPS_FAILED_YIELD,
              severity: 'err',
              message: `[DIRECTIVE EXECUTED] ${detail}.`,
          };
}

export function getConfigKey(config: MissionConfig): string {
    return [
        config.missionId, config.launchId, config.propulsionId, config.powerId, config.busId,
        [...config.payloads].sort().join('+'), config.groundId, config.userId,
    ].join('|');
}