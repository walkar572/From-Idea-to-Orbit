import { describe, expect, it } from 'vitest';
import type { MissionId, VizCamera } from '../types';
import { renderMissionVizCanvas } from './gmatSimulator';
import { evaluateArchitecture, getPresetConfig } from './systemsEngineering';

const CHAR_W = 6.6;

interface Point {
    x: number;
    y: number;
}

function recordFrame(w: number, h: number, prog: number, id: MissionId, cam: VizCamera) {
    const texts: { text: string; x: number; y: number; align: string }[] = [];
    const strokes: { points: Point[]; dashed: boolean }[] = [];
    const arcs: (Point & { r: number; translated: boolean })[] = [];
    let path: Point[] = [];
    let dashed = false;
    let align = 'start';
    let origin: Point | null = null;
    let scale = 1;

    const ctx = new Proxy(
        {},
        {
            get(_target, prop) {
                switch (prop) {
                    case 'beginPath':
                        return () => (path = []);
                    case 'moveTo':
                    case 'lineTo':
                        return (x: number, y: number) => path.push({ x, y });
                    case 'stroke':
                        return () => path.length && strokes.push({ points: path, dashed });
                    case 'setLineDash':
                        return (d: number[]) => (dashed = d.length > 0);
                    case 'fillText':
                        return (text: string, x: number, y: number) => texts.push({ text, x, y, align });
                    case 'measureText':
                        return (text: string) => ({ width: text.length * CHAR_W });
                    case 'arc':
                        return (x: number, y: number, r: number) =>
                            arcs.push({
                                x: (origin?.x ?? 0) + x * scale,
                                y: (origin?.y ?? 0) + y * scale,
                                r: r * scale,
                                translated: origin !== null,
                            });
                    case 'translate':
                        return (x: number, y: number) => (origin = { x, y });
                    case 'scale':
                        return (s: number) => (scale = s);
                    case 'restore':
                        return () => {
                            origin = null;
                            scale = 1;
                        };
                    case 'createRadialGradient':
                        return () => ({ addColorStop() {} });
                    default:
                        return () => {};
                }
            },
            set(_target, prop, value) {
                if (prop === 'textAlign') align = value;
                return true;
            },
        }
    ) as unknown as CanvasRenderingContext2D;

    renderMissionVizCanvas(ctx, w, h, prog, evaluateArchitecture(getPresetConfig(id)), cam);
    return { texts, strokes, arcs };
}

const last = <T,>(items: T[]) => items[items.length - 1];
const near = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y) < 1e-6;

describe('renderMissionVizCanvas', () => {
    const cases: [number, number, MissionId, VizCamera][] = [];
    for (const [w, h] of [
        [309, 460],
        [900, 400],
    ]) {
        for (const id of ['bionutrients', 'dawn', 'europa'] as MissionId[]) {
            for (const cam of ['3d', 'top', 'follow'] as VizCamera[]) cases.push([w, h, id, cam]);
        }
    }

    it.each(cases)('%ix%i %s %s: trajectory, target and labels stay on screen', (w, h, id, cam) => {
        const { texts, strokes, arcs } = recordFrame(w, h, 0.6, id, cam);

        const planned = strokes.find(s => s.dashed)!.points;
        const target = arcs.find(a => near(a, last(planned)));
        expect(target, 'dashed trajectory ends at the target marker').toBeDefined();
        expect(target!.x - target!.r).toBeGreaterThanOrEqual(0);
        expect(target!.x + target!.r).toBeLessThanOrEqual(w);
        expect(target!.y - target!.r).toBeGreaterThanOrEqual(0);
        expect(target!.y + target!.r).toBeLessThanOrEqual(h);

        const flown = strokes.filter(s => !s.dashed && s.points.length > 2).pop()!.points;
        const craft = arcs.find(a => a.translated)!;
        expect(near(last(flown), craft), 'progress line reaches the spacecraft').toBe(true);

        for (const t of texts) {
            const width = t.text.length * CHAR_W;
            const left = t.align === 'center' ? t.x - width / 2 : t.x;
            expect(left, t.text).toBeGreaterThanOrEqual(0);
            expect(left + width, t.text).toBeLessThanOrEqual(w);
        }
    });
});
