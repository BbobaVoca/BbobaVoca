/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'main': '#1CC500',
        'light-green': '#EEF6EC'
      },
      fontFamily: {
        'PretendardVariable': ['PretendardVariable'],
        'ownglyph': ['Ownglyph_Siwoo'],
        'uhbeezziba' : ['Uhbeezziba'],
      }
    },
  },
  plugins: [],
}

