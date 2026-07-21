import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#132033",
        muted: "#667085",
        line: "#e5e7eb",
        accent: "#4f46e5",
        skybolt: "#0ea5e9"
      },
      boxShadow: {
        soft: "0 12px 34px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
