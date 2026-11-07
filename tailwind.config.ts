import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#050509",
        charcoal: {
          DEFAULT: "#0E0F17",
          light: "#171926",
          border: "#252738",
        },
        silver: {
          DEFAULT: "#C8CCD8",
          bright: "#F5F7FA",
          muted: "#8A8F9E",
        },
        ice: {
          DEFAULT: "#93C5FD",
          glow: "#60A5FA",
          subtle: "rgba(147, 197, 253, 0.14)",
        },
        violet: {
          DEFAULT: "#818CF8",
          deep: "#4F46E5",
          glow: "#A78BFA",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "cyber-grid":
          "radial-gradient(circle at 56% 42%, rgba(99, 102, 241, 0.14) 0%, rgba(56, 189, 248, 0.05) 34%, transparent 68%), radial-gradient(circle at 52% 82%, rgba(129, 140, 248, 0.12) 0%, transparent 55%), linear-gradient(180deg, #040407 0%, #07070F 55%, #040408 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
