/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'main': '#1CC500',
        'light-green': '#EEF6EC',
        'select-gray': '#545454',
        'unselect-gray': '#F4F4F4'
      },
      fontFamily: {
        'PretendardVariable': ['PretendardVariable'],
        'ownglyph': ['Ownglyph_Siwoo'],
        'uhbeezziba' : ['Uhbeezziba'],
        'Maplestory' : ['Maplestory'],
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}

