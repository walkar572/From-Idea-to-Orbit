import type { ArchitectureEval, VizCamera } from '../types';

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

    const cx = w * 0.5;
    const cy = vizCamera === 'follow' ? h * 0.42 : h * 0.52;
    const tilt = vizCamera === 'top' ? 1.0 : vizCamera === 'follow' ? 0.18 : 0.48;
    const radiusScale = vizCamera === 'follow' ? 1.5 : 1.35;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.11)';
    ctx.lineWidth = 1;
    for (let r = 45; r <= 220; r += 45) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * radiusScale, r * radiusScale * tilt, 0, 0, Math.PI * 2);
        ctx.stroke();
    }
    const isLeo = ev.m.au === 1.0;
    const centerGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 32);
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
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px JetBrains Mono, monospace';
    const labelY = vizCamera === 'follow' ? cy - 40 : cy + 36;
    ctx.fillText(isLeo ? 'EARTH (LEO / ISS)' : 'SUN (HELIOCENTRIC)', cx - 48, labelY);
    const angle = prog * Math.PI * 1.65 - Math.PI * 0.7;
    const radStart = 65;
    const radEnd = isLeo ? 115 : 165;
    const curR = radStart + (radEnd - radStart) * prog;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    for (let p = 0; p <= 1.0; p += 0.02) {
        const a = p * Math.PI * 1.65 - Math.PI * 0.7;
        const r = radStart + (radEnd - radStart) * p;
        const px = cx + Math.cos(a) * r * radiusScale;
        const py = cy + Math.sin(a) * r * radiusScale * tilt;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let p = 0; p <= prog; p += 0.02) {
        const a = p * Math.PI * 1.65 - Math.PI * 0.7;
        const r = radStart + (radEnd - radStart) * p;
        const px = cx + Math.cos(a) * r * radiusScale;
        const py = cy + Math.sin(a) * r * radiusScale * tilt;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();
    const endAngle = 1.0 * Math.PI * 1.65 - Math.PI * 0.7;
    const tx = cx + Math.cos(endAngle) * radEnd * radiusScale;
    const ty = cy + Math.sin(endAngle) * radEnd * radiusScale * tilt;
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(tx, ty, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e9d5ff';
    ctx.fillText(`TARGET: ${ev.m.code}`, tx - 45, ty - 16);
    const sx = cx + Math.cos(angle) * curR * radiusScale;
    const sy = cy + Math.sin(angle) * curR * radiusScale * tilt;
    ctx.save();
    ctx.translate(sx, sy);
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
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillText(
        `MISSION VIZ CAMERA: ${vizCamera.toUpperCase()} | CONOPS PROGRESS: ${Math.round(prog * 100)}%`,
        16,
        24
    );
}