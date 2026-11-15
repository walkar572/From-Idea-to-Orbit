import { NASA_MISSIONS } from '../data/missions';
import { SEGMENTS_DB } from '../data/modules';
import type { ArchitectureEval, GameState, Mission, PowerOption } from '../types';

export const GROUND_EFF_MIN = 0.9;

export function effectiveWatts(power: PowerOption, m: Mission): number {
    switch (power.type) {
        case 'solar':
            return Math.round(power.baseWatts / (m.au * m.au));
        case 'station':
            return m.issHosted ? power.baseWatts : 0;
        case 'nuclear':
            return power.baseWatts;
    }
}

export function getMission(state: GameState): Mission {
    const m = NASA_MISSIONS.find(x => x.id === state.missionId);
    if (!m) throw new Error(`Unknown mission: ${state.missionId}`);
    return m;
}

export function evaluateArchitecture(state: GameState): ArchitectureEval {
    const m = getMission(state);
    const launch = SEGMENTS_DB.launchVehicles.find(x => x.id === state.launchId);
    const prop = SEGMENTS_DB.propulsionOptions.find(x => x.id === state.propulsionId);
    const power = SEGMENTS_DB.powerOptions.find(x => x.id === state.powerId);
    const bus = SEGMENTS_DB.busOptions.find(x => x.id === state.busId);
    const ground = SEGMENTS_DB.groundSegments.find(x => x.id === state.groundId);
    const user = SEGMENTS_DB.userSegments.find(x => x.id === state.userId);

    if (!launch || !prop || !power || !bus || !ground || !user) {
        throw new Error('Invalid architecture: one of the selected segment IDs is unknown.');
    }

    const selectedPayloadObjs = SEGMENTS_DB.payloads.filter(p => state.payloads.includes(p.id));
    const payloadCost = selectedPayloadObjs.reduce((s, p) => s + p.cost, 0);
    const totalCost =launch.cost + prop.cost + power.cost + bus.cost + payloadCost + ground.cost + user.cost;
    const budgetOk= totalCost <= m.budgetLimit;
    const payloadMass = selectedPayloadObjs.reduce((s, p) => s + p.mass, 0);
    const totalMass = +(prop.mass + power.mass + bus.mass + payloadMass).toFixed(1);
    const massOk = totalMass <= launch.maxMass;
    const payloadVol = selectedPayloadObjs.reduce((s, p) => s + p.vol, 0);
    const totalVol = bus.volUsed + payloadVol;
    const maxAllowedVol = m.maxVolumeUnit + (launch.maxVolBonus || 0);
    const volOk = totalVol <= maxAllowedVol;
    const wattsGenerated = effectiveWatts(power, m);
    const payloadPower = selectedPayloadObjs.reduce((s, p) => s + p.power, 0);
    const wattsConsumed = bus.powerDraw + payloadPower;
    const powerOk = wattsGenerated >= wattsConsumed;
    const missingReqPayloads = m.requiredPayloads.filter(reqId => !state.payloads.includes(reqId));
    const incompatiblePayloads = selectedPayloadObjs.filter(p => p.tag !== m.wavelengthReq);
    const payloadReqOk = missingReqPayloads.length === 0 && incompatiblePayloads.length === 0;
    const launchOk = launch.allowedMissions.includes(m.id);
    const trajOk = prop.bestFor.includes(m.id);
    const groundEff = ground.efficiency[m.id];
    const groundOk = groundEff >= GROUND_EFF_MIN;
    const userOk = user.bestFor === m.id;
    const shieldOk = bus.shielding >= m.radHazard;
    const checks = [
        budgetOk, massOk, volOk, powerOk, payloadReqOk, trajOk, groundOk, userOk, shieldOk, launchOk
    ];
    const totalChecks = checks.length;
    const checksPassed = checks.filter(Boolean).length;
    let cmlLevel: 1 | 2 | 3 | 4 = 1;
    let cmlText = 'JPL CML 1: Initial Idea';
    let mdlText = 'MDL: Office Hours';

    if (state.stage >= 2) {
        cmlLevel = 2;
        cmlText = 'JPL CML 2: Feasibility Concept';
        mdlText = 'MDL: Concept Development';

        if (checksPassed >= 5) {
            cmlLevel = 3;
            cmlText = 'JPL CML 3: Trade Space Explored';
            mdlText = 'MDL: Trade Studies';
        }
        if (checksPassed === totalChecks) {
            cmlLevel = 4;
            cmlText = 'JPL CML 4: Point Design Verified';
            mdlText = 'MDL: Point Design Ready';
        }
    }

    return {
        m, launch, prop, power, bus, ground, user, selectedPayloadObjs,
        totalCost, budgetOk,
        totalMass, massOk,
        totalVol, maxAllowedVol, volOk,
        wattsGenerated, wattsConsumed, powerOk,
        missingReqPayloads, incompatiblePayloads, payloadReqOk,
        launchOk, trajOk, groundEff, groundOk, userOk, shieldOk,
        checksPassed, totalChecks, cmlLevel, cmlText, mdlText
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

export function getConfigKey(state: GameState): string {
    return [
        state.missionId, state.launchId, state.propulsionId, state.powerId, state.busId,
        [...state.payloads].sort().join('+'), state.groundId, state.userId,
    ].join('|');
}