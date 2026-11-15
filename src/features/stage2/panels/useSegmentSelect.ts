import { useCallback } from 'react';
import { useGame } from '../../../context/GameContext';
import type { SegmentKey } from '../../../types';

export function useSegmentSelect(): (key: SegmentKey, id: string) => void {
    const { dispatch, playTone } = useGame();
    return useCallback(
        (key, id) => {
            playTone(680);
            dispatch({ type: 'SET_SEGMENT', key, id });
        },
        [dispatch, playTone]
    );
}
