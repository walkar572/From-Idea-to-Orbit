import type { ReactNode } from 'react';

interface OptionCardProps {
    selected: boolean;
    onSelect: () => void;
    className?: string;
    children: ReactNode;
}

export function OptionCard({ selected, onSelect, className = '', children }: OptionCardProps) {
    return (
        <button
            type="button"
            aria-pressed={selected}
            onClick={onSelect}
            className={`w-full text-left rounded-xl transition cursor-pointer ${className} ${
                selected
                    ? 'border-blue-500 bg-blue-950/40 glow-cyan'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
            }`}
        >
            {children}
        </button>
    );
}
