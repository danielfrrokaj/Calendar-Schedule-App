/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      colors: {
        primary: {
          dark: '#2b6777',    // Deep teal
          medium: '#52ab98',  // Mint green
          light: '#c8d8e4',   // Light blue-gray
        },
        neutral: {
          white: '#ffffff',   // Pure white
          gray: '#f2f2f2',    // Light gray
        }
      },
    },
  },
  plugins: [],
} 