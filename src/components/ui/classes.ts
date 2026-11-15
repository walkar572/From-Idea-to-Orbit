import type { CmlLevel } from '../../types';

export function toggleClass(active: boolean): string {
    return active
        ? 'border bg-blue-500/20 text-blue-300 border-blue-500/40'
        : 'border border-transparent text-slate-400 hover:text-white';
}

export function cmlBadgeClass(level: CmlLevel): string {
    if (level === 4) return 'bg-blue-500/30 text-blue-200 border-blue-400/60';
    if (level === 3) return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    return 'bg-slate-700/60 text-slate-300 border-slate-600';
}
