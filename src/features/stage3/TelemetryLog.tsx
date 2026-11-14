import { useEffect, useRef } from 'react';
import type { LogEntry } from '../../hooks/useSimulation';

interface Props {
    logs: LogEntry[];
}

const colorMap: Record<LogEntry['type'], string> = {
    info: 'text-slate-300',
    ok: 'text-blue-400',
    warn: 'text-red-400',
    err: 'text-red-500 font-bold',
};

export function TelemetryLog({ logs }: Props) {
    const boxRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }, [logs]);

    return (
        <div className="glass-panel rounded-lg p-4 border border-slate-800 flex flex-col h-[230px]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 font-mono text-xs">
                <span className="text-blue-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 " />
                    CONOPS & GMAT TELEMETRY LOG
                </span>
                <span className="text-slate-500 text-[10px]">NPR 7120.5</span>
            </div>
            <div ref={boxRef} className="flex-grow overflow-y-auto space-y-1.5 font-mono text-[11px] pr-1">
                {logs.map((l, i) => (
                    <div key={i} className={colorMap[l.type]}>
                        <span className="text-slate-600">[{l.ts}]</span> {l.msg}
                    </div>
                ))}
            </div>
        </div>
    );
}