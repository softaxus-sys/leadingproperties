import type { Config } from "tailwindcss";

// Brand colours taken from the Leading Properties logo: near-black wordmark, red accent.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#E1251B",
          dark: "#B81C14",
          light: "#FDECEB",
        },
        // Warm off-white page ground: lets the black wordmark read crisply without stark white.
        paper: {
          DEFAULT: "#F5F3EF",
          dark: "#E9E5DE",
        },
        ink: {
          DEFAULT: "#141414",
          soft: "#2A2A2A",
          muted: "#71717A",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
