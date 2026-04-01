/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {},
  },

  plugins: [],

  safelist: [
    "from-green-400", "to-emerald-500",
    "from-yellow-300", "to-amber-400",
    "from-orange-300", "to-yellow-400",
    "from-red-400", "to-pink-500",
    "from-yellow-200", "to-yellow-400",
    "from-orange-400", "to-amber-500",
    "from-red-400", "to-rose-500",
    "from-amber-700", "to-orange-900",
    "from-amber-900", "to-yellow-900",
    "from-green-300", "to-emerald-400",
    "from-emerald-400", "to-cyan-400",
  ],
};