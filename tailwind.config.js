/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      mono: ["Roboto Mono", "monospace"],
    },
    extend: {
      fontFamily: {
        retro: ["Zen Dots", "monospace"],
      },
      colors: {
        gray: {
          350: "#acb3bf",
        },
      },
    },
  },
  plugins: [],
};
