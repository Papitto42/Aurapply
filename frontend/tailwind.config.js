/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
      colors: {
        'trust-blue': '#0066FF',
        'trust-blue-dark': '#0052CC',
        'success-green': '#10B981',
        'success-green-dark': '#059669',
        'primary-orange': '#FF4D00',
        'primary-orange-light': '#FF6B35',
      },
    },
  },
  plugins: [],
}



