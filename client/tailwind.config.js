export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ieee: {
          50: "#e6f3f9",
          100: "#cce7f3",
          200: "#99cfe7",
          300: "#66b7db",
          400: "#339fcf",
          500: "#0087c3",
          600: "#00629B",  // Official IEEE Blue
          700: "#004d7a",
          800: "#003859",
          900: "#002338"
        },
        yorku: {
          red: "#E31837"  // Official YorkU Red
        }
      }
    }
  },
  plugins: []
};
