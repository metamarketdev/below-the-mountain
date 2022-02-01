const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      tablet: '960px',
      desktop: '1248px',
    },
    extend: {
      fontFamily: {
        sans: ['Rubik', ...defaultTheme.fontFamily.sans],
        title: ['Staatliches', ...defaultTheme.fontFamily.sans],
      },

      gridTemplateColumns: {
        16: 'repeat(16, minmax(0, 1fr))', // 16 column grid
      },
    },
  },
};
