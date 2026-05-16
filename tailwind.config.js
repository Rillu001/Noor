/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        charcoal: "#0B0C0E",
        elevated: "#14161A",
        gold: "#C9A962",
        emerald: "#2D6A4F",
        beige: "#D4C4A8",
        olive: "#6B705C",
        cream: "#F5F3EF",
        muted: "#9B9A97",
      },
    },
  },
  plugins: [],
};
