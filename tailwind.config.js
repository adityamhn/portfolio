/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        accent: "#FD5A57",
        hover: "#8b7db8"
      },
      fontFamily: {
        'grotesk': ['Cabinet Grotesk', 'sans-serif'],
        'mono': ['monospace']
      }
    }
  },
  plugins: []
};
