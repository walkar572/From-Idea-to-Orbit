interface ToastProps {
    message: string;
    visible: boolean;
}

export function Toast({ message, visible }: ToastProps) {
    return (
        <div
            className={`fixed bottom-5 right-5 z-50 max-w-md glass-panel px-4 py-3 rounded-xl border border-blue-500/50 text-xs font-mono text-white shadow-2xl items-center gap-3 ${
                visible ? 'flex' : 'hidden'
            }`}
        >
            <i className="fa-solid fa-circle-info text-blue-400 text-base" />
            <span>{message}</span>
        </div>
    );
}
