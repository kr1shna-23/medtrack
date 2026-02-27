export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A6CF7',
        accent: '#FFFFFF',
        dark: {
          DEFAULT: '#000000',
          secondary: '#0A0A23',
          tertiary: '#11113B'
        },
        text: {
          primary: '#EDEDED',
          secondary: '#B0B0B0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '16px',
        full: '999px',
      },
      boxShadow: {
        DEFAULT: '0 4px 24px rgba(0,0,0,0.4)',
      },
      maxWidth: {
        container: '1200px',
      },
      padding: {
        container: '1.5rem',
      },
    },
  },
  plugins: [],
}
