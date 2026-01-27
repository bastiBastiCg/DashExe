/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#0F2A44",     // azul corporativo
        accent: "#2563EB",      // azul eléctrico
        gold: "#F5C16C",        // dorado suave marca
        background: "#F3F5F9",
        card: "#FFFFFF",
        muted: "#6B7280",
      },
    },
  },
  plugins: [],
};
