/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        monteserat: ["Montserrat", "sans-serif"],
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(to right, rgba(66, 78, 242, 1) 1%, rgba(102, 109, 255, 0.3) 100%)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
