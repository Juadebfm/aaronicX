/** @type {import('tailwindcss').Config} */
import scrollbarHide from "tailwind-scrollbar-hide";

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
  plugins: [scrollbarHide],
};
