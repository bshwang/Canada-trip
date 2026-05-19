import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#059669", dark: "#047857", light: "#d1fae5" },
        sky2: { DEFAULT: "#0284c7", light: "#e0f2fe" },
      },
    },
  },
  plugins: [],
};
export default config;
