import { useCallback, useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { NasaDocsModal } from './components/NasaDocsModal';
import { Stage1 } from './features/stage1/Stage1';
import { Stage2 } from './features/stage2/Stage2';
import { Stage3 } from './features/stage3/Stage3';

function AppShell() {
    const { state } = useGame();
    const [docsOpen, setDocsOpen] = useState(false);
    const openDocs = useCallback(() => setDocsOpen(true), []);
    const closeDocs = useCallback(() => setDocsOpen(false), []);

    return (
        <>
            <Header onOpenDocs={openDocs} />
            <main className="flex-grow max-w-[1440px] w-full mx-auto px-3 lg:px-6 py-5">
                <div className={state.stage === 1 ? '' : 'hidden'}>
                    <Stage1 />
                </div>
                <div className={state.stage === 2 ? '' : 'hidden'}>
                    <Stage2 />
                </div>
                <div className={state.stage === 3 ? '' : 'hidden'}>
                    <Stage3 visible={state.stage === 3} />
                </div>
            </main>
            <Footer />
            <NasaDocsModal open={docsOpen} onClose={closeDocs} />
        </>
    );
}

export default function App() {
    return (
        <ToastProvider>
            <GameProvider>
                <AppShell />
            </GameProvider>
        </ToastProvider>
    );
}
