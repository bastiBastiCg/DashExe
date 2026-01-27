/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F2A44",
        secondary: "#F59E0B",
        background: "#F3F5F9",
        card: "#FFFFFF",
        muted: "#6B7280",
      },
    },
  },
  plugins: [],
}
