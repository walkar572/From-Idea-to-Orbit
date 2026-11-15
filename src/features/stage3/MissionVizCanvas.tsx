import type { RefObject } from 'react';

interface Props {
    canvasRef: RefObject<HTMLCanvasElement>;
}

export function MissionVizCanvas({ canvasRef }: Props) {
    return (
        <canvas ref={canvasRef} className="w-full h-full block" />
    );
}