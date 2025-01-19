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
    },
  },
  plugins: [],
} satisfies Config
