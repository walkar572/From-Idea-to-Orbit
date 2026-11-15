import { useCallback, useRef, useState } from 'react';
import type { PolySynth } from 'tone';

export type PlayTone = (freq?: number, dur?: string) => void;

export interface UseAudioReturn {
    playTone: PlayTone;
    muted: boolean;
    toggleMute: () => void;
}

let toneModule: Promise<typeof import('tone')> | null = null;
const loadTone = () => (toneModule ??= import('tone'));

export function useAudio(): UseAudioReturn {
    const synthRef = useRef<Promise<PolySynth> | null>(null);
    const mutedRef = useRef(false);
    const [muted, setMuted] = useState(false);

    const playRaw = useCallback(async (freq: number, dur: string) => {
        try {
            const Tone = await loadTone();
            synthRef.current ??= Promise.resolve().then(() => {
                const synth = new Tone.PolySynth(Tone.Synth, {
                    oscillator: { type: 'triangle' },
                    envelope: { attack: 0.005, decay: 0.08, sustain: 0.04, release: 0.08 },
                }).toDestination();
                synth.volume.value = -13;
                return synth;
            });
            const synth = await synthRef.current;
            if (Tone.getContext().state !== 'running') await Tone.start();
            synth.triggerAttackRelease(freq, dur);
        } catch (err) {
            console.warn('Telemetry audio unavailable:', err);
        }
    }, []);

    const playTone = useCallback<PlayTone>(
        (freq = 620, dur = '32n') => {
            if (mutedRef.current) return;
            void playRaw(freq, dur);
        },
        [playRaw]
    );

    const toggleMute = useCallback(() => {
        const next = !mutedRef.current;
        mutedRef.current = next;
        setMuted(next);
        if (!next) void playRaw(880, '32n');
    }, [playRaw]);

    return { playTone, muted, toggleMute };
}
