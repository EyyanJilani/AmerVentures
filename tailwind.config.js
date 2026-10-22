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
        // Blue: primary brand colour (text, dark sections, buttons)
        brand: { DEFAULT: '#0B4F8C', 900: '#073763', 700: '#1766B3' },
        // Light green: accents (600 is the darker shade for text on white)
        accent: { DEFAULT: '#8EDBA9', 600: '#1F8A52', 100: '#E5F7EC' },
        sand: '#E6F0F9',
        offwhite: '#F4F8FC',
        charcoal: '#22303F',
        muted: '#5B6878',
        line: '#DCE6EF',
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
