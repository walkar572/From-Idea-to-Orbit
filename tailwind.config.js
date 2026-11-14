/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                nasa: {
                    bg: '#0a0f1a',
                    panel: '#0f1420',
                    border: '#1e293b',
                    primary: '#0b3d91',
                    accent: '#fc3d21',
                    text: '#e5e7eb',
                    muted: '#94a3b8',
                    danger: '#dc2626',
                    'danger-soft': '#ef4444'
                },
            },
        },
    },
    plugins: [],
};