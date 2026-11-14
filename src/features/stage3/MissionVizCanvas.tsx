import type { RefObject } from 'react';

interface Props {
    canvasRef: RefObject<HTMLCanvasElement | null>;
}

export function MissionVizCanvas({ canvasRef }: Props) {
    return (
        <canvas
            ref={canvasRef as RefObject<HTMLCanvasElement>}
            className="w-full h-full block"
        />
    );
}