import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Toast } from '../components/Toast';

const TOAST_MS = 5200;

type ShowToast = (message: string) => void;

const ToastContext = createContext<ShowToast | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    const showToast = useCallback<ShowToast>(msg => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        setMessage(msg);
        setVisible(true);
        timeoutRef.current = window.setTimeout(() => setVisible(false), TOAST_MS);
    }, []);

    useEffect(
        () => () => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        },
        []
    );

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <Toast message={message} visible={visible} />
        </ToastContext.Provider>
    );
}

export function useToast(): ShowToast {
    const showToast = useContext(ToastContext);
    if (!showToast) throw new Error('useToast must be used inside <ToastProvider>');
    return showToast;
}
