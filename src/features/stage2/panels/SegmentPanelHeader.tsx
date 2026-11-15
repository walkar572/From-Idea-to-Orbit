import type { ReactNode } from 'react';

interface SegmentPanelHeaderProps {
    kicker: string;
    title: string;
    aside: ReactNode;
    asideClassName: string;
}

export function SegmentPanelHeader({ kicker, title, aside, asideClassName }: SegmentPanelHeaderProps) {
    return (
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
                <span className="font-mono text-[10px] uppercase text-blue-400 block">{kicker}</span>
                <h3 className="text-base font-bold text-white">{title}</h3>
            </div>
            <span className={`font-mono text-xs ${asideClassName}`}>{aside}</span>
        </div>
    );
}
