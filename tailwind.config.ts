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
        gw: { night: "#0B130F", deep: "#101C16", forest: "#1B3027", gold: "#C9B27C", "gold-deep": "#8F7A45", sand: "#F3EDE0", mist: "#D9D4C6" },
        ink: {
          DEFAULT: "#111111",
          soft: "#3F3F46",
          muted: "#71717A",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
