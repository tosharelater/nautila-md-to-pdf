import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Nautila Palette Atlantique */
        ink: '#14333B',
        green: {
          DEFAULT: '#2E7D8C',
          900: '#14333B',
          600: '#2E7D8C',
          400: '#63A6A0',
          200: '#63A6A0',
        },
        sage: '#2E7D8C',
        mint: '#63A6A0',
        paper: '#F2EFE6',
        surface: '#E8E4D6',
        /* legacy aliases kept for existing classNames */
        navy: '#14333B',
        gold: '#2E7D8C',
        'steel-blue': '#63A6A0',
        'off-white': '#F2EFE6',
        'dark-text': '#14333B',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
