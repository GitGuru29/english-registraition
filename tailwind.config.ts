import type { Config } from 'tailwindcss'
export default { content: ['./index.html', './src/**/*.{ts,tsx}'], theme: { extend: { colors: { ink: '#14213d', leaf: '#177e64', mist: '#f4f7f5' } } }, plugins: [] } satisfies Config
