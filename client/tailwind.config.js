/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563eb",
          blueLight: "#3b82f6",
          green: "#10b981",
          red: "#ef4444",
          dark: "#1f2937",
          light: "#6b7280",
          bg: "#f9fafb",
          card: "#ffffff",
        },
      },

      borderRadius: {
        base: "12px",
      },

      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.08)",
      },

      fontFamily: {
        primary: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
