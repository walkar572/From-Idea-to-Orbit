import type { ConopsEvent } from '../../types';

interface Props {
    event: ConopsEvent;
    onResolve: (option: 1 | 2) => void;
}

export function ConopsModal({ event, onResolve }: Props) {
    return (
        <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-md p-4 sm:p-6 flex flex-col overflow-y-auto z-20">
            <div className="my-auto w-full flex flex-col items-center text-center">
                <div className="hidden sm:flex w-12 h-12 rounded-full bg-red-700/20 border border-red-500 items-center justify-center text-red-300 text-xl mb-3">
                    <i className="fa-solid fa-satellite-dish" />
                </div>
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-blue-400">
                    SPACE & GROUND SEGMENT OPERATIONS
                </span>
                <h4 className="text-base sm:text-xl font-bold text-white mt-1 mb-2">{event.title}</h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mb-4 sm:mb-5 leading-relaxed">{event.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-xl">
                    <button
                        onClick={() => onResolve(1)}
                        className="p-3 sm:p-3.5 rounded-xl bg-blue-950/90 hover:bg-blue-900 border border-blue-500/50 text-left transition"
                    >
                        <div className="font-mono text-xs font-bold text-blue-300 flex items-center justify-between gap-2">
                            <span>{event.opt1Title}</span>
                            <i className="fa-solid fa-check-circle" />
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">{event.opt1Desc}</p>
                    </button>
                    <button
                        onClick={() => onResolve(2)}
                        className="p-3 sm:p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-700/60 text-left transition"
                    >
                        <div className="font-mono text-xs font-bold text-red-400 flex items-center justify-between gap-2">
                            <span>{event.opt2Title}</span>
                            <i className="fa-solid fa-shield-halved" />
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">{event.opt2Desc}</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
