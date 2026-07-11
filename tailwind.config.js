/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#0a0a0f',
          darker: '#0d0d1a',
          dark: '#111125',
          mid: '#1a1a3e',
          light: '#2a2a5e',
          cyan: '#00f0ff',
          'cyan-dim': '#00a0aa',
          magenta: '#ff00aa',
          'magenta-dim': '#aa0077',
          yellow: '#ffee00',
          'yellow-dim': '#aaaa00',
          green: '#00ff66',
          'green-dim': '#00aa44',
          red: '#ff3344',
          'red-dim': '#aa2233',
          orange: '#ff8800',
          purple: '#aa44ff',
          'purple-dim': '#7722cc',
          white: '#e0e0ff',
          'white-dim': '#8888aa',
        },
      },
      fontFamily: {
        cyber: ['Orbitron', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
        body: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00f0ff, 0 0 20px rgba(0, 240, 255, 0.3)',
        'neon-magenta': '0 0 5px #ff00aa, 0 0 20px rgba(255, 0, 170, 0.3)',
        'neon-green': '0 0 5px #00ff66, 0 0 20px rgba(0, 255, 102, 0.3)',
        'neon-red': '0 0 5px #ff3344, 0 0 20px rgba(255, 51, 68, 0.3)',
        'neon-yellow': '0 0 5px #ffee00, 0 0 20px rgba(255, 238, 0, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
        'glitch': 'glitch 3s infinite',
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 5px #00f0ff, 0 0 10px #00f0ff' },
          '100%': { textShadow: '0 0 20px #00f0ff, 0 0 40px #00f0ff, 0 0 60px #00f0ff' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glitch: {
          '0%, 90%, 100%': { transform: 'translate(0)' },
          '91%': { transform: 'translate(-2px, 1px)' },
          '92%': { transform: 'translate(2px, -1px)' },
          '93%': { transform: 'translate(-1px, -1px)' },
          '94%': { transform: 'translate(1px, 2px)' },
          '95%': { transform: 'translate(-1px, -2px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
