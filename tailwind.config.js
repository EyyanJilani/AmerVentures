/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', md: '2rem', lg: '2.5rem' },
      screens: { xl: '1200px' },
    },
    extend: {
      colors: {
        navy: { DEFAULT: '#14213D', 900: '#0E182E', 700: '#22325A' },
        gold: { DEFAULT: '#C8A15A', 600: '#B08A44', 100: '#F1E7D3' },
        sand: '#EDE6D8',
        offwhite: '#F7F5F0',
        charcoal: '#2A2D34',
        muted: '#5F6470',
        line: '#E3DED3',
        whatsapp: '#25D366',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        arabic: ['Tajawal', 'system-ui', 'sans-serif'],
      },
      borderRadius: { DEFAULT: '5px' },
      boxShadow: {
        soft: '0 1px 2px rgba(20,33,61,0.06), 0 4px 14px rgba(20,33,61,0.06)',
      },
    },
  },
  plugins: [],
}
