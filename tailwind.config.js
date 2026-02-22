/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        visited: '#22C55E',
        unvisited: '#3B82F6',
      }
    },
  },
  plugins: [],
}
