import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        hdfc: {
          blue: '#004B87',
          blueDeep: '#002D5A',
          blueBright: '#0066B3',
          red: '#ED1C24',
          redDeep: '#C41018',
          navy: '#0A1628',
          slate: '#1E3A5F',
          mist: '#F0F4F8',
          line: '#E1E8EF',
          emerald: '#059669',
          emeraldLight: '#D1FAE5',
          amber: '#D97706',
          amberLight: '#FEF3C7',
          gold: '#F5A623',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,75,135,.06), 0 4px 14px rgba(0,75,135,.08)',
        glow: '0 0 24px rgba(0,75,135,.15)',
        'glow-red': '0 0 24px rgba(237,28,36,.12)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(0,75,135,.35)' },
          '70%': { boxShadow: '0 0 0 10px rgba(0,75,135,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(0,75,135,0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      },
      animation: {
        shimmer: 'shimmer 1.2s ease-in-out infinite',
        fadeIn: 'fadeIn 0.3s ease-out',
        pulseRing: 'pulseRing 2s infinite',
        float: 'float 3s ease-in-out infinite',
      }
    }
  },
  plugins: []
};

export default config;
