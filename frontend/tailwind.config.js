/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
      colors: {
        // Semantic color tokens using CSS variables
        background: 'rgb(var(--background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        primary: 'rgb(var(--text-primary) / <alpha-value>)',
        secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
        tertiary: 'rgb(var(--text-tertiary) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        
        // Accent colors (same for both themes)
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



