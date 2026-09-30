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
        ink: '#16281c',
        green: {
          DEFAULT: '#415d43',
          900: '#415d43',
          600: '#709775',
          400: '#8fb996',
          200: '#a1cca5',
        },
        sage: '#709775',
        mint: '#a1cca5',
        paper: '#fafaf7',
        surface: '#f2f4f0',
        /* legacy aliases kept for existing classNames */
        navy: '#415d43',
        gold: '#709775',
        'steel-blue': '#8fb996',
        'off-white': '#fafaf7',
        'dark-text': '#12211a',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
