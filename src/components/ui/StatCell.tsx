interface StatCellProps {
    label: string;
    value: string;
    valueClassName?: string;
    inline?: boolean;
}

export function StatCell({ label, value, valueClassName = '', inline = false }: StatCellProps) {
    if (inline) {
        return (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between gap-2">
                <span className="text-slate-400">{label}</span>
                <span className={`font-bold ${valueClassName}`}>{value}</span>
            </div>
        );
    }
    return (
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 min-w-0">
            <span className="text-[10px] text-slate-400 block">{label}</span>
            <span className={`font-bold block ${valueClassName}`}>{value}</span>
        </div>
    );
}
