import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom brand colors
        brand: {
          DEFAULT: "#1e40af",
          light: "#60a5fa",
          dark: "#1e3a8a",
        },
        // Optional text color
        darkBlue: "#2a4352",
        // Add more as needed
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
