/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#FBFBF9',
        'bg-secondary': '#EBE5DC',
        'bg-dark': '#4B5347',
        'text-main': '#1C1C1A',
        'text-muted': '#8A8A85',
        'text-light': '#FFFFFF',
        'border-light': '#D1D1C7',
        'accent': '#3d4937',
      },
      fontFamily: {
        heading: ['"Sacramento"', 'cursive'],
        subheading: ['"Merriweather Sans"', 'sans-serif'],
        body: ['"Roboto"', 'sans-serif'],
      },
      spacing: {
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '48px',
        xl: '96px',
        xxl: '160px',
      },
      borderRadius: {
        none: '0px',
        full: '9999px',
        arch: '200px 200px 0 0',
      },
      opacity: {
        hover: '0.8',
        muted: '0.6',
      },
      boxShadow: {
        none: 'none',
        subtle: '0 4px 20px rgba(0,0,0,0.03)',
      },
      zIndex: {
        base: '1',
        floating: '5',
        overlay: '10',
      },
      transitionProperty: {
        default: 'all',
      },
      transitionDuration: {
        default: '300ms',
      },
      transitionTimingFunction: {
        default: 'ease-in-out',
      }
    },
  },
  plugins: [],
}
