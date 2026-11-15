import { describe, expect, it } from 'vitest';
import { NASA_MISSIONS } from '../data/missions';
import { SEGMENTS_DB } from '../data/modules';
import type { MissionConfig, MissionId } from '../types';
import {
    CONOPS_FAILED_YIELD,
    effectiveWatts,
    evaluateArchitecture,
    getConfigKey,
    getMission,
    getPresetConfig,
    resolveConopsDirective,
    solarFluxPct,
    solarFluxWm2,
} from './systemsEngineering';

const configFor = (id: MissionId, overrides: Partial<MissionConfig> = {}): MissionConfig => ({
    ...getPresetConfig(id),
    ...overrides,
});

describe('evaluateArchitecture', () => {
    it.each(NASA_MISSIONS.map(m => m.id))('certifies the %s MDL preset at CML 4', id => {
        const ev = evaluateArchitecture(configFor(id));
        expect(ev.totalChecks).toBe(10);
        expect(ev.checks.filter(c => !c.ok)).toEqual([]);
        expect(ev.cmlLevel).toBe(4);
    });

    it('keeps check ids unique and counts passed checks', () => {
        const ev = evaluateArchitecture(configFor('dawn', { busId: 'bio_fep_container' }));
        expect(new Set(ev.checks.map(c => c.id)).size).toBe(ev.checks.length);
        expect(ev.checksPassed).toBe(ev.checks.filter(c => c.ok).length);
        expect(ev.checks.find(c => c.id === 'shielding')?.ok).toBe(false);
    });

    it('drops to CML 3 with a few failures and CML 2 with many', () => {
        const almost = evaluateArchitecture(configFor('europa', { groundId: 'dsn_xband' }));
        expect(almost.cmlLevel).toBe(3);
        const wrong = evaluateArchitecture({ ...getPresetConfig('bionutrients'), missionId: 'europa' });
        expect(wrong.cmlLevel).toBe(2);
    });

    it('throws on an unknown segment id', () => {
        expect(() => evaluateArchitecture(configFor('punch', { busId: 'nope' }))).toThrow(/unknown bus "nope"/);
    });
});

describe('power', () => {
    const issPower = SEGMENTS_DB.powerOptions.find(p => p.type === 'station')!;
    const rosa = SEGMENTS_DB.powerOptions.find(p => p.id === 'solar_rosa')!;

    it('offers station power only to ISS-hosted missions', () => {
        for (const m of NASA_MISSIONS) {
            expect(effectiveWatts(issPower, m)).toBe(m.issHosted ? issPower.baseWatts : 0);
        }
    });

    it('applies the inverse-square law to solar arrays', () => {
        expect(effectiveWatts(rosa, getMission('dawn'))).toBe(306);
        expect(solarFluxPct(2.8)).toBe(13);
        expect(solarFluxWm2(1)).toBe(1361);
    });

    it('cannot certify Dawn on ISS station power', () => {
        const ev = evaluateArchitecture(configFor('dawn', { powerId: issPower.id }));
        expect(ev.powerOk).toBe(false);
        expect(ev.cmlLevel).toBeLessThan(4);
    });
});

describe('getConfigKey', () => {
    it('ignores payload order', () => {
        const a = configFor('europa');
        const b = { ...a, payloads: [...a.payloads].reverse() };
        expect(getConfigKey(a)).toBe(getConfigKey(b));
    });

    it('returns presets with their own payload array', () => {
        const preset = getPresetConfig('punch');
        preset.payloads.push('framing_cam');
        expect(getMission('punch').optimalPreset.payloads).not.toContain('framing_cam');
    });
});

describe('resolveConopsDirective', () => {
    it.each(NASA_MISSIONS.map(m => m.id))('%s: option A with the preset yields 100%%', id => {
        const outcome = resolveConopsDirective(evaluateArchitecture(configFor(id)), 1);
        expect(outcome).toMatchObject({ scienceYield: 1, severity: 'ok' });
    });

    it.each(NASA_MISSIONS.map(m => m.id))('%s: option B yield matches the penalty in its description', id => {
        const event = getMission(id).conopsEvent;
        const penaltyPct = Number(event.opt2Desc.match(/-(\d+)%/)?.[1]);
        const outcome = resolveConopsDirective(evaluateArchitecture(configFor(id)), 2);
        expect(outcome.severity).toBe('warn');
        expect(Math.round((1 - outcome.scienceYield) * 100)).toBe(penaltyPct);
    });

    it.each<[MissionId, Partial<MissionConfig>]>([
        ['bionutrients', { payloads: ['fep_packs'] }],
        ['dawn', { propulsionId: 'direct_high_energy' }],
        ['europa', { busId: 'bus_composite' }],
        ['punch', { busId: 'bio_fep_container' }],
    ])('%s: option A fails without the hardware it depends on', (id, overrides) => {
        const outcome = resolveConopsDirective(evaluateArchitecture(configFor(id, overrides)), 1);
        expect(outcome).toMatchObject({ scienceYield: CONOPS_FAILED_YIELD, severity: 'err' });
    });
});
