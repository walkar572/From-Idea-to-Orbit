import { NASA_MISSIONS } from '../data/missions';
import { SEGMENTS_DB } from '../data/modules';
import type { ArchitectureEval, GameState, Mission } from '../types';

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
    let wattsGenerated = power.baseWatts;
    if (power.type === 'solar') {
        wattsGenerated = Math.round(power.baseWatts / (m.au * m.au));
    }
    const payloadPower = selectedPayloadObjs.reduce((s, p) => s + p.power, 0);
    const wattsConsumed = bus.powerDraw + payloadPower;
    const powerOk = wattsGenerated >= wattsConsumed;
    const missingReqPayloads = m.requiredPayloads.filter(reqId => !state.payloads.includes(reqId));
    const incompatiblePayloads = selectedPayloadObjs.filter(p => p.tag !== m.wavelengthReq);
    const payloadReqOk = missingReqPayloads.length === 0 && incompatiblePayloads.length === 0;
    const trajOk = prop.bestFor.includes(m.id);
    const groundEff = ground.efficiency[m.id] || 0.5;
    const groundOk = groundEff >= 0.9;
    const userOk = user.bestFor === m.id;
    const shieldOk = bus.shielding >= m.radHazard;
    const checks = [
        budgetOk, massOk, volOk, powerOk, payloadReqOk, trajOk, groundOk, userOk, shieldOk
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
        trajOk, groundEff, groundOk, userOk, shieldOk,
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
export function getConfigKey(state: GameState): string {
    return [
        state.missionId, state.launchId, state.propulsionId, state.powerId, state.busId,
        [...state.payloads].sort().join('+'), state.groundId, state.userId,
    ].join('|');
}