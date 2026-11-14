# Space Mission Architect — NASA Systems Engineering Edition

Interactive web game for NASA Space Apps Challenge. Formulate a mission, tune 4 segments (Launch / Space / Ground / User), run a GMAT-style simulation with ConOps decision checkpoints, and get a debrief compared against the real NASA fleet.

## Stack

- React 18 + TypeScript
- Vite 4
- Tailwind CSS 3
- Tone.js (telemetry audio)

## Сloud hosting

https://from-idea-to-orbit-bjqs.onrender.com/

## Run locally

```bash
npm install
npm run dev
# open http://localhost:5173
```

## Build

```bash
npm run build
npm run preview
```

## Structure

```
src/
├── main.tsx
├── App.tsx
├── styles.css
├── types.ts
├── data/               missions + hardware catalog
├── engine/             CML 1-4 evaluator + GMAT renderer
├── hooks/              useAudio, useSimulation
├── context/            GameContext (useReducer)
├── components/         Header, Footer, Toast, NasaDocsModal
└── features/
    ├── stage1/         mission selection
    ├── stage2/         MDL config (4 segments)
    └── stage3/         GMAT simulation + debrief
```

## Data sources

- **Julie Levri, NASA SmallSat Institute (March 2025)** — "Design and Develop Science Missions": 4 official NASA segments, mission case studies (BioNutrients-2, PUNCH, Dawn, Europa Clipper).
- **NASA NPR 7123.1** — Systems Engineering Processes and Requirements.
- **NASA JPL Concept Maturity Levels (CML 1–4)** — formulation maturity scale.
- **GMAT** — General Mission Analysis Tool (trajectory propagation, Delta-V).
- **NASA Mission Viz** — interactive 3D/2D trajectory visualisation.

## Notes

- ❌ **Not working via `file://`** — open with `npm run dev` (Vite dev server).
- Node.js 18+ required.