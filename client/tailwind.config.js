// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         brand: {
//           blue: "#2563eb",
//           blueLight: "#3b82f6",
//           green: "#10b981",
//           red: "#ef4444",
//           dark: "#1f2937",
//           light: "#6b7280",
//           bg: "#f9fafb",
//           card: "#ffffff",
//         },
//       },

//       borderRadius: {
//         base: "12px",
//       },

//       boxShadow: {
//         card: "0 4px 12px rgba(0,0,0,0.08)",
//       },

//       fontFamily: {
//         primary: ["Inter", "sans-serif"],
//       },
//     },
//   },
//   plugins: [],
// };
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // 1. REPLACING DEFAULT FONTS
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Ensure you have a clean font
      },
      // 2. SOFTENING THE RADIUS GLOBALLY
      // Whenever you used 'rounded-lg' or 'rounded-md', it will now be super round
      borderRadius: {
        'md': '0.75rem',  // 12px (was 6px)
        'lg': '1rem',     // 16px (was 8px)
        'xl': '1.5rem',   // 24px (was 12px)
        '2xl': '2rem',    // 32px
      },
      // 3. UPDATING THE COLOR PALETTE
      colors: {
        // Overwrite 'gray' to be a cooler, bluish slate (Standard "Modern" look)
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6', // Common background
          200: '#E5E7EB',
          800: '#1F2937',
          900: '#111827',
        },
        // Overwrite 'blue' to be that premium Indigo/Violet
        blue: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1', // The "Indigo" look
          600: '#4f46e5', // Primary Action
          700: '#4338ca',
        }
      },
      // 4. SOFT SHADOWS
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)', // Softer, less harsh
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}