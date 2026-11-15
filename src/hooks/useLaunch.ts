import { useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { useToast } from '../context/ToastContext';
import { getLaunchHold } from '../engine/systemsEngineering';

export function useLaunch(): () => boolean {
    const { ev, dispatch, playTone } = useGame();
    const showToast = useToast();

    return useCallback(() => {
        const hold = getLaunchHold(ev);
        if (hold) {
            playTone(220, '8n');
            showToast(hold);
            return false;
        }
        playTone(600);
        dispatch({ type: 'START_SIM' });
        return true;
    }, [ev, dispatch, playTone, showToast]);
}
