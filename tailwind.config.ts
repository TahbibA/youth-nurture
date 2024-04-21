/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "2xl": { max: "1440px" },
        xlplus: { max: "1380px" },
        xl: { max: "1280px" },
        lg: { max: "1024px" },
        md: { max: "768px" },
        sm: { max: "640px" },
        xs: { max: "480px" },
      },
      colors: {
        accent: "#805ad5",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
