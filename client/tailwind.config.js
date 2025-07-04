/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#59e89c',
        'dark-green': '#00986a',
        'neutral-dark': '#171717',
        'neutral-light': '#cfcfcf',
        'white-ish': '#fff',
        'blue-france': '#318ce7',
        'blue-capri': '#00bfff',
        'error-red': '#d2122e',
      },
    },
  },
  plugins: [],
}
