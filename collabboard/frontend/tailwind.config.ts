import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './context/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#F6F8F3',
          ink: '#111318',
          surface: '#FFFFFF',
          surfaceTint: '#EAF6F3',
          sidebar: '#111318',
          primary: '#255DE3',
          presence: '#00A896',
          success: '#24A148',
          warning: '#F4B000',
          error: '#FF5A5F',
          discovery: '#7C5CFF',
          border: '#D9E0EA',
          muted: '#657084',
          text: '#111318',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(17, 19, 24, 0.10)',
        tactile: '5px 5px 0 rgba(17, 19, 24, 0.12)',
        lift: '0 24px 60px rgba(37, 93, 227, 0.16)',
      },
      keyframes: {
        floatIn: {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.16)' },
        },
        scanLine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        floatIn: 'floatIn 520ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
        scanLine: 'scanLine 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;

