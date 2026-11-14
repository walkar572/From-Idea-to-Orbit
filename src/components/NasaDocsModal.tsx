import { useEffect } from 'react';

interface NasaDocsModalProps {
    open: boolean;
    onClose: () => void;
}

export function NasaDocsModal({ open, onClose }: NasaDocsModalProps) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            onClick={e => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="glass-panel max-w-3xl w-full rounded-2xl p-6 border border-blue-500/40 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                        <i className="fa-solid fa-book-journal-whills text-blue-400 text-xl" />
                        <h3 className="text-lg font-bold text-white">NASA Systems Engineering Reference Guide</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-lg px-2"
                        aria-label="Close"
                    >
                        <i className="fa-solid fa-xmark" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-300 leading-relaxed">
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                        <h4 className="font-mono font-bold text-blue-300 mb-1">1. Four Mission Segments (Julie Levri, NASA)</h4>
                        <p>
                            Every NASA science mission is divided into 4 interdependent segments:{' '}
                            <b>Launch Segment</b> (launch vehicle & stowage services), <b>Space Segment</b> (spacecraft
                            bus, instruments, orbiters), <b>Ground Segment</b> (DSN stations & mission control), and{' '}
                            <b>User Segment</b> (scientists analyzing returned samples/data and publishing research).
                            Engineers always <i>"Begin with the End in Mind"</i>.
                        </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                        <h4 className="font-mono font-bold text-blue-300 mb-1">2. JPL Concept Maturity Levels (CML 1–4) & MDL</h4>
                        <p>
                            NASA JPL's <b>Concept Maturity Levels</b> measure mission formulation maturity: from{' '}
                            <b>CML 1</b> (Initial Idea) and <b>CML 2</b> (Feasibility) to <b>CML 3</b> (Trade Studies in
                            the <b>Mission Design Lab</b>) and <b>CML 4</b> (Point Design — a verified, balanced baseline
                            ready for implementation).
                        </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                        <h4 className="font-mono font-bold text-blue-300 mb-1">3. Webinar Case Studies: BioNutrients-2, PUNCH, Dawn</h4>
                        <p>
                            <b>BioNutrients-2 (ISS):</b> engineered yeast spores producing beta-carotene under strict mass
                            (&lt;250g container) and volume (&lt;300mL) constraints. <b>PUNCH:</b> 4-SmallSat constellation
                            performing 3D polarimetric tomography of the solar wind. <b>Dawn:</b> solar-electric ion
                            propulsion mission to orbit both Vesta and Ceres.
                        </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                        <h4 className="font-mono font-bold text-slate-400 mb-1">4. GMAT & NASA Mission Viz</h4>
                        <p>
                            <b>GMAT (General Mission Analysis Tool)</b> models orbital propagation, Delta-V budgets, and
                            maneuvers, while <b>NASA Mission Viz</b> provides interactive 3D spatial visualization of
                            trajectories and celestial bodies.
                        </p>
                    </div>
                </div>

                <div className="pt-2 text-right">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-mono font-bold text-xs uppercase transition"
                    >
                        Close Guide
                    </button>
                </div>
            </div>
        </div>
    );
}