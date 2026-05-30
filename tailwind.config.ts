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
        dahilia: {
          primary: '#D4A574',      /* Warm Caramel */
          secondary: '#8B6914',    /* Golden Brown */
          accent: '#E07B39',       /* Burnt Orange */
          cream: '#FFF8F0',        /* Warm Cream */
          chocolate: '#4A3728',    /* Dark Chocolate */
          copper: '#B87333',       /* Copper */
          wheat: '#F5DEB3',        /* Wheat */
          honey: '#D4A84B',        /* Honey Gold */
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'warm': '0 10px 40px -10px rgba(212, 165, 116, 0.4)',
        'premium': '0 25px 50px -12px rgba(74, 55, 40, 0.25)',
      }
    },
  },
  plugins: [],
}
export default config
