import { useGame } from '../../context/GameContext';
import { evaluateArchitecture } from '../../engine/systemsEngineering';
import { TelemetryBar } from './TelemetryBar';
import { SegmentTabs } from './SegmentTabs';
import { VerificationMatrix } from './VerificationMatrix';
import { CadBlueprint } from './CadBlueprint';
import { LaunchPanel } from './panels/LaunchPanel';
import { SpacePanel } from './panels/SpacePanel';
import { GroundPanel } from './panels/GroundPanel';
import { UserPanel } from './panels/UserPanel';

export function Stage2() {
    const { state } = useGame();
    const ev = evaluateArchitecture(state);

    return (
        <section className="space-y-5">
            <TelemetryBar ev={ev} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 space-y-4">
                    <SegmentTabs />
                    <div className="glass-panel rounded-lg p-5 border border-slate-800 space-y-5">
                        {state.activeSegmentTab === 'launch' && <LaunchPanel ev={ev} />}
                        {state.activeSegmentTab === 'space' && <SpacePanel ev={ev} />}
                        {state.activeSegmentTab === 'ground' && <GroundPanel ev={ev} />}
                        {state.activeSegmentTab === 'user' && <UserPanel ev={ev} />}
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-5">
                    <CadBlueprint ev={ev} />
                    <VerificationMatrix ev={ev} />
                </div>
            </div>
        </section>
    );
}