/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          void: "#050508",
          panel: "#0D0E15",
          panelElevated: "#131522",
          border: "rgba(0, 240, 255, 0.18)",
          borderHover: "rgba(0, 240, 255, 0.45)",
          cyan: "#00F0FF",
          magenta: "#B829EA",
          emerald: "#00FF9D",
          crimson: "#FF2A5F",
          amber: "#FFB800",
          muted: "#6B7280",
          text: "#E2E8F0"
        }
      },
      fontFamily: {
        orbitron: ['"Orbitron"', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.35)',
        'neon-magenta': '0 0 15px rgba(184, 41, 234, 0.35)',
        'neon-emerald': '0 0 15px rgba(0, 255, 157, 0.35)',
        'neon-crimson': '0 0 15px rgba(255, 42, 95, 0.35)',
        'panel': '0 8px 32px 0 rgba(0, 0, 0, 0.65)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { borderColor: 'rgba(0, 240, 255, 0.2)', boxShadow: '0 0 8px rgba(0, 240, 255, 0.1)' },
          '100%': { borderColor: 'rgba(0, 240, 255, 0.6)', boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
