/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF',
        secondary: '#5D5C5C',
        grey: {
          100: '#353333',
          200: '#232323',
        },
        accent: '#7A15FF',

      }
    },
  },
  plugins: [],
}