import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

/**
 * Design tokens para Venezuela Solidaria.
 * Inspirado en Apple/Stripe/Linear/Vercel: minimal, lujo, profesional, humano.
 */
const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
    './src/hooks/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // Paleta corporativa humanizada
        primary: {
          50: '#E6EEFF',
          100: '#C2D5FF',
          200: '#8FB1FF',
          300: '#5A8CFF',
          400: '#2D6BFF',
          500: '#0057FF', // base
          600: '#0046D1',
          700: '#0036A3',
          800: '#002675',
          900: '#001747',
          950: '#000F2B',
          DEFAULT: '#0057FF',
          foreground: '#FFFFFF',
        },
        secondary: {
          50: '#E0FBF6',
          100: '#B3F1E5',
          200: '#80E5D2',
          300: '#4DDABE',
          400: '#26CFB0',
          500: '#00C2A8', // base
          600: '#009B87',
          700: '#007565',
          800: '#004E43',
          900: '#002822',
          DEFAULT: '#00C2A8',
          foreground: '#FFFFFF',
        },
        emergency: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#E53935', // base
          600: '#C62828',
          700: '#9C1C1C',
          800: '#721111',
          900: '#480606',
          DEFAULT: '#E53935',
          foreground: '#FFFFFF',
        },
        accent: {
          50: '#F0EFFF',
          100: '#DDD9FF',
          200: '#BBB3FF',
          300: '#998DFF',
          400: '#7767FF',
          500: '#6C63FF', // base
          600: '#534BBF',
          700: '#3B3580',
          800: '#231F40',
          900: '#0C0900',
          DEFAULT: '#6C63FF',
          foreground: '#FFFFFF',
        },
        success: { DEFAULT: '#10B981', foreground: '#FFFFFF' },
        warning: { DEFAULT: '#F59E0B', foreground: '#FFFFFF' },
        info: { DEFAULT: '#3B82F6', foreground: '#FFFFFF' },
        background: '#FAFAFA',
        foreground: '#0F172A',
        muted: { DEFAULT: '#F1F5F9', foreground: '#64748B' },
        border: '#E2E8F0',
        input: '#E2E8F0',
        ring: '#0057FF',
        card: { DEFAULT: '#FFFFFF', foreground: '#0F172A' },
        destructive: { DEFAULT: '#E53935', foreground: '#FFFFFF' },
        // Soporte dark mode
        dark: {
          bg: '#0A0F1C',
          bgSoft: '#0F172A',
          card: '#111827',
          border: '#1F2937',
          foreground: '#F8FAFC',
          muted: '#1E293B',
          mutedForeground: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        display: ['var(--font-satoshi)', 'var(--font-inter)', 'ui-sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['clamp(3.5rem, 8vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '800' }],
        'display-xl': ['clamp(2.75rem, 6vw, 4.5rem)', { lineHeight: '1.08', letterSpacing: '-0.035em', fontWeight: '800' }],
        'display-lg': ['clamp(2.25rem, 4.5vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-md': ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-sm': ['clamp(1.5rem, 2.5vw, 2rem)', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)',
        'soft-lg': '0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        'soft-xl': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.05)',
        'soft-2xl': '0 20px 25px -5px rgba(15, 23, 42, 0.10), 0 8px 10px -6px rgba(15, 23, 42, 0.06)',
        'glow-primary': '0 0 0 1px rgba(0,87,255,0.15), 0 10px 40px -10px rgba(0,87,255,0.40)',
        'glow-emergency': '0 0 0 1px rgba(229,57,53,0.15), 0 10px 40px -10px rgba(229,57,53,0.40)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-down': 'fade-down 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-soft': 'pulse-soft 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'marquee': 'marquee 40s linear infinite',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0057FF 0%, #6C63FF 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0057FF 0%, #00C2A8 100%)',
        'gradient-soft': 'linear-gradient(180deg, rgba(0,87,255,0.04) 0%, rgba(0,194,168,0.04) 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(0,87,255,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(108,99,255,0.12) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(0,194,168,0.10) 0px, transparent 50%)',
        'noise': "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")",
      },
    },
  },
  plugins: [animate],
};

export default config;
