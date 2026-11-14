import { useCallback, useRef, useState } from 'react';
import * as Tone from 'tone';

export interface UseAudioReturn {
    playTone: (freq?: number, dur?: string) => void;
    muted: boolean;
    toggleMute: () => void;
}

export function useAudio(): UseAudioReturn {
    const synthRef = useRef<Tone.PolySynth | null>(null);
    const mutedRef = useRef(false);
    const [muted, setMuted] = useState(false);

    const playRaw = useCallback((freq: number, dur: string) => {
        try {
            if (!synthRef.current) {
                const synth = new Tone.PolySynth(Tone.Synth, {
                    oscillator: { type: 'triangle' },
                    envelope: { attack: 0.005, decay: 0.08, sustain: 0.04, release: 0.08 },
                }).toDestination();
                synth.volume.value = -13;
                synthRef.current = synth;
            }
            if (Tone.context.state !== 'running') {
                void Tone.start();
            }
            synthRef.current.triggerAttackRelease(freq, dur);
        } catch {
        }
    }, []);

    const playTone = useCallback(
        (freq: number = 620, dur: string = '32n') => {
            if (mutedRef.current) return;
            playRaw(freq, dur);
        },
        [playRaw]
    );

    const toggleMute = useCallback(() => {
        const next = !mutedRef.current;
        mutedRef.current = next;
        setMuted(next);
        if (!next) playRaw(880, '32n');
    }, [playRaw]);

    return { playTone, muted, toggleMute };
}