/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        adminNavy: '#101D35',
        adminBlue: '#246BFD',
        adminGreen: '#19B887',
        adminBg: '#F5F7FB'
      }
    },
  },
  plugins: [],
}
