import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';
import type {
    ArchitectureEval,
    GameState,
    MissionConfig,
    MissionId,
    SMD,
    SegmentKey,
    SegmentTab,
    Stage,
    VizCamera,
} from '../types';
import { useAudio, type PlayTone } from '../hooks/useAudio';
import { evaluateArchitecture, getPresetConfig, toMissionConfig } from '../engine/systemsEngineering';

export type GameAction =
    | { type: 'GO_TO_STAGE'; stage: Stage }
    | { type: 'START_SIM' }
    | { type: 'SET_FILTER'; filter: SMD }
    | { type: 'SET_SEGMENT_TAB'; tab: SegmentTab }
    | { type: 'SELECT_MISSION'; missionId: MissionId }
    | { type: 'SET_SEGMENT'; key: SegmentKey; id: string }
    | { type: 'TOGGLE_PAYLOAD'; id: string }
    | { type: 'APPLY_MDL_PRESET' }
    | { type: 'SET_VIZ_CAMERA'; camera: VizCamera };

export interface AppState extends GameState {
    simRestartKey: number;
    flownConfig: MissionConfig | null;
}

const DEFAULT_MISSION: MissionId = 'bionutrients';

const initialState: AppState = {
    stage: 1,
    smdFilter: 'ALL',
    activeSegmentTab: 'launch',
    vizCamera: '3d',
    ...getPresetConfig(DEFAULT_MISSION),
    simRestartKey: 0,
    flownConfig: null,
};

function reducer(state: AppState, action: GameAction): AppState {
    switch (action.type) {
        case 'GO_TO_STAGE':
            return { ...state, stage: action.stage };

        case 'START_SIM':
            return {
                ...state,
                stage: 3,
                simRestartKey: state.simRestartKey + 1,
                flownConfig: toMissionConfig(state),
            };

        case 'SET_FILTER':
            return { ...state, smdFilter: action.filter };

        case 'SET_SEGMENT_TAB':
            return { ...state, activeSegmentTab: action.tab };

        case 'SELECT_MISSION':
            return { ...state, ...getPresetConfig(action.missionId), stage: 2, activeSegmentTab: 'launch' };

        case 'SET_SEGMENT': {
            const next = { ...state };
            next[action.key] = action.id;
            return next;
        }

        case 'TOGGLE_PAYLOAD': {
            const exists = state.payloads.includes(action.id);
            return {
                ...state,
                payloads: exists ? state.payloads.filter(p => p !== action.id) : [...state.payloads, action.id],
            };
        }

        case 'APPLY_MDL_PRESET':
            return { ...state, ...getPresetConfig(state.missionId) };

        case 'SET_VIZ_CAMERA':
            return { ...state, vizCamera: action.camera };

        default:
            return state;
    }
}

interface GameContextValue {
    state: AppState;
    ev: ArchitectureEval;
    dispatch: Dispatch<GameAction>;
    playTone: PlayTone;
    muted: boolean;
    toggleMute: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { playTone, muted, toggleMute } = useAudio();
    const ev = useMemo(() => evaluateArchitecture(state), [state]);

    const value = useMemo<GameContextValue>(
        () => ({ state, ev, dispatch, playTone, muted, toggleMute }),
        [state, ev, playTone, muted, toggleMute]
    );

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
    return ctx;
}
