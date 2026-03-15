/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#f4c025",
        "background-light": "#f8f8f5",
        "background-dark": "#181611",
        "accent-dark": "#393528",
        "surface-dark": "#2a261f",
        "neutral-dark": "#1c1a16",
        "neutral-border": "#393528",
      },
      fontFamily: {
        display: ["Spline Sans", "sans-serif"],
        serif: ["Lora", "serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      boxShadow: {
        glow: "0 0 30px rgba(244, 192, 37, 0.35)",
      },
    },
  },
  plugins: [],
};
