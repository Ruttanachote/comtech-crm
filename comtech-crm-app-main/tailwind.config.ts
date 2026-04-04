import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#00d58d',
          600: '#00bc7d', // DEFAULT - Updated from Figma (#00bc7d)
          700: '#009664',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        }
      }
    }
  }
}
