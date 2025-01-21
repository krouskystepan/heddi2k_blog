import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        red: 'var(--red)',
        orange: 'var(--orange)',
        yellow: 'var(--yellow)',
        green: 'var(--green)',

        purple: 'var(--purple)',
        blue: 'var(--blue)',
      },
      animation: {
        'stripe-move': 'stripeMove 2s linear infinite',
      },
      keyframes: {
        stripeMove: {
          '0%': {
            backgroundPosition: '0 0',
          },
          '100%': {
            backgroundPosition: '0 60px',
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
