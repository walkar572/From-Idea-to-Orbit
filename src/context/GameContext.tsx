import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useReducer,
    useRef,
    useState,
    type Dispatch,
    type ReactNode,
} from 'react';
import { NASA_MISSIONS } from '../data/missions';
import type { GameState, MissionId, SMD, SegmentTab, Stage, VizCamera } from '../types';
import { useAudio } from '../hooks/useAudio';
import { getConfigKey } from '../engine/systemsEngineering';

export type GameAction =
    | { type: 'GO_TO_STAGE'; stage: Stage }
    | { type: 'START_SIM' }
    | { type: 'SET_FILTER'; filter: SMD }
    | { type: 'SET_SEGMENT_TAB'; tab: SegmentTab }
    | { type: 'SELECT_MISSION'; missionId: MissionId }
    | { type: 'SET_LAUNCH'; id: string }
    | { type: 'SET_PROPULSION'; id: string }
    | { type: 'SET_POWER'; id: string }
    | { type: 'SET_BUS'; id: string }
    | { type: 'TOGGLE_PAYLOAD'; id: string }
    | { type: 'SET_GROUND'; id: string }
    | { type: 'SET_USER'; id: string }
    | { type: 'APPLY_MDL_PRESET' }
    | { type: 'SET_VIZ_CAMERA'; camera: VizCamera };

interface ExtendedState extends GameState {
    simRestartKey: number;
    flownConfigKey: string | null;
}
const initialState: ExtendedState = {
    stage: 1,
    smdFilter: 'ALL',
    activeSegmentTab: 'launch',
    missionId: 'bionutrients',
    launchId: 'ng18_cygnus',
    propulsionId: 'leo_iss_transfer',
    powerId: 'iss_bus_pwr',
    busId: 'bio_fep_container',
    payloads: ['fep_packs', 'incubator_melfi'],
    groundId: 'iss_payload_ops',
    userId: 'user_centrifuge',
    vizCamera: '3d',
    simRestartKey: 0,
    flownConfigKey: null,
};
function getMissionPreset(missionId: MissionId) {
    const m = NASA_MISSIONS.find(x => x.id === missionId);
    if (!m) throw new Error(`Unknown mission: ${missionId}`);
    return m.optimalPreset;
}
function reducer(state: ExtendedState, action: GameAction): ExtendedState {
    switch (action.type) {
        case 'GO_TO_STAGE':
            return { ...state, stage: action.stage };

        case 'START_SIM':
            return {
                ...state,
                stage: 3,
                simRestartKey: state.simRestartKey + 1,
                flownConfigKey: getConfigKey(state),
            };

        case 'SET_FILTER':
            return { ...state, smdFilter: action.filter };

        case 'SET_SEGMENT_TAB':
            return { ...state, activeSegmentTab: action.tab };

        case 'SELECT_MISSION': {
            const preset = getMissionPreset(action.missionId);
            return {
                ...state,
                missionId: action.missionId,
                launchId: preset.launchId,
                propulsionId: preset.propulsionId,
                powerId: preset.powerId,
                busId: preset.busId,
                payloads: [...preset.payloads],
                groundId: preset.groundId,
                userId: preset.userId,
                stage: 2,
                activeSegmentTab: 'launch',
            };
        }

        case 'SET_LAUNCH': return { ...state, launchId: action.id };
        case 'SET_PROPULSION': return { ...state, propulsionId: action.id };
        case 'SET_POWER': return { ...state, powerId: action.id };
        case 'SET_BUS': return { ...state, busId: action.id };
        case 'SET_GROUND': return { ...state, groundId: action.id };
        case 'SET_USER': return { ...state, userId: action.id };

        case 'TOGGLE_PAYLOAD': {
            const exists = state.payloads.includes(action.id);
            return {
                ...state,
                payloads: exists
                    ? state.payloads.filter(p => p !== action.id)
                    : [...state.payloads, action.id],
            };
        }

        case 'APPLY_MDL_PRESET': {
            const preset = getMissionPreset(state.missionId);
            return {
                ...state,
                launchId: preset.launchId,
                propulsionId: preset.propulsionId,
                powerId: preset.powerId,
                busId: preset.busId,
                payloads: [...preset.payloads],
                groundId: preset.groundId,
                userId: preset.userId,
            };
        }

        case 'SET_VIZ_CAMERA':
            return { ...state, vizCamera: action.camera };

        default:
            return state;
    }
}

export interface ToastState {
    message: string;
    visible: boolean;
}

interface GameContextValue {
    state: ExtendedState;
    dispatch: Dispatch<GameAction>;
    showToast: (message: string) => void;
    toast: ToastState;
    playTone: (freq?: number, dur?: string) => void;
    muted: boolean;
    toggleMute: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { playTone, muted, toggleMute } = useAudio();
    const [toast, setToast] = useState<ToastState>({ message: '', visible: false });
    const timeoutRef = useRef<number | null>(null);

    const showToast = useCallback((message: string) => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        setToast({ message, visible: true });
        timeoutRef.current = window.setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 5200);
    }, []);

    const value = useMemo<GameContextValue>(
        () => ({ state, dispatch, showToast, toast, playTone, muted, toggleMute }),
        [state, toast, showToast, playTone, muted, toggleMute]
    );

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
    return ctx;
}