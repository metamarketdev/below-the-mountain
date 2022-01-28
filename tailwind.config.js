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
    },

    // colors: {
    //   white: '#ffffff',
    //   black: '#000000',
    //   'marker-blue': '#2B8AFF',
    //   'marker-blue-light': '#2B8AFF',
    //   'marker-blue-dark': '#2B8AFF',
    // },
  },
  variants: {
    extend: {},
  },
};
