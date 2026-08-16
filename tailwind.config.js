/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      maxWidth: {
        '5xl': '1280px',
        '6xl': '1440px',
        '7xl': '1600px',
        '8xl': '1800px',
        'screen-3xl': '1920px',
      },
      colors: {
        primary: "#1abc9c",
        secondary: "#34495e",
        accent: "#ff5d47",
        brand: "#c02942",
        ink: "#263238",
        muted: "#6c7a91",
        navy: "#1e293b"
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.12)",
        premium: "0 15px 35px rgba(0, 0, 0, 0.1)"
      }
    }
  },
  plugins: []
};
