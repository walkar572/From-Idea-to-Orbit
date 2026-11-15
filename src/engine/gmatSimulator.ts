import type { ArchitectureEval, VizCamera } from '../types';

const FONT = '11px JetBrains Mono, monospace';
const TRAJ_STEPS = 50;
const ANGLE_START = -Math.PI * 0.7;
const ANGLE_SPAN = Math.PI * 1.65;
const RAD_START = 65;
const DESIGN_W = 560;
const DESIGN_H = 400;
const EDGE_PAD = 8;

export function renderMissionVizCanvas(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    prog: number,
    ev: ArchitectureEval,
    vizCamera: VizCamera = '3d'
): void {
    ctx.fillStyle = '#040711';
    ctx.fillRect(0, 0, w, h);

    const k = Math.min(1, w / DESIGN_W, h / DESIGN_H);
    const spriteScale = Math.max(0.6, k);
    const cx = w * 0.5;
    const cy = vizCamera === 'follow' ? h * 0.42 : h * 0.52;
    const tilt = vizCamera === 'top' ? 1.0 : vizCamera === 'follow' ? 0.18 : 0.48;
    const radiusScale = (vizCamera === 'follow' ? 1.5 : 1.35) * k;

    const clampLabelX = (x: number, text: string) => {
        const half = ctx.measureText(text).width / 2;
        return Math.min(Math.max(x, EDGE_PAD + half), w - EDGE_PAD - half);
    };

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.11)';
    ctx.lineWidth = 1;
    for (let r = 45; r <= 220; r += 45) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * radiusScale, r * radiusScale * tilt, 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    const isLeo = ev.m.au === 1.0;
    const bodyR = 32 * k;
    const centerGrad = ctx.createRadialGradient(cx, cy, 4 * k, cx, cy, bodyR);
    if (isLeo) {
        centerGrad.addColorStop(0, '#38bdf8');
        centerGrad.addColorStop(0.6, '#0284c7');
        centerGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
    } else {
        centerGrad.addColorStop(0, '#fffbeb');
        centerGrad.addColorStop(0.5, '#f59e0b');
        centerGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    }
    ctx.fillStyle = centerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, bodyR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = FONT;
    ctx.textAlign = 'center';
    const bodyLabel = isLeo ? 'EARTH (LEO / ISS)' : 'SUN (HELIOCENTRIC)';
    const bodyLabelY = vizCamera === 'follow' ? cy - (bodyR + 8) : cy + bodyR + 4;
    ctx.fillText(bodyLabel, clampLabelX(cx, bodyLabel), bodyLabelY);

    const radEnd = isLeo ? 115 : 165;
    const pointAt = (p: number) => {
        const a = ANGLE_START + ANGLE_SPAN * p;
        const r = (RAD_START + (radEnd - RAD_START) * p) * radiusScale;
        return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * tilt };
    };
    const strokeTrajectory = (until: number) => {
        ctx.beginPath();
        const start = pointAt(0);
        ctx.moveTo(start.x, start.y);
        for (let i = 1; i < TRAJ_STEPS && i / TRAJ_STEPS < until; i++) {
            const pt = pointAt(i / TRAJ_STEPS);
            ctx.lineTo(pt.x, pt.y);
        }
        const end = pointAt(until);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    };

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    strokeTrajectory(1);
    ctx.setLineDash([]);

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    strokeTrajectory(prog);

    const target = pointAt(1);
    const targetR = 10 * spriteScale;
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(target.x, target.y, targetR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e9d5ff';
    const targetLabel = `TARGET: ${ev.m.code}`;
    const targetLabelY = target.y - (targetR + 6);
    const targetHalfW = ctx.measureText(targetLabel).width / 2;
    if (target.x - targetHalfW >= EDGE_PAD && target.x + targetHalfW <= w - EDGE_PAD) {
        ctx.fillText(targetLabel, target.x, targetLabelY);
    } else {
        ctx.fillText('TARGET:', clampLabelX(target.x, 'TARGET:'), targetLabelY - 13);
        ctx.fillText(ev.m.code, clampLabelX(target.x, ev.m.code), targetLabelY);
    }

    const craft = pointAt(prog);
    ctx.save();
    ctx.translate(craft.x, craft.y);
    ctx.scale(spriteScale, spriteScale);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(14, 0);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'left';
    const camText = `MISSION VIZ CAMERA: ${vizCamera.toUpperCase()}`;
    const progText = `CONOPS PROGRESS: ${Math.round(prog * 100)}%`;
    const hud = `${camText} | ${progText}`;
    if (ctx.measureText(hud).width <= w - 32) {
        ctx.fillText(hud, 16, 24);
    } else {
        ctx.fillText(camText, 16, 24);
        ctx.fillText(progText, 16, 40);
    }
}
