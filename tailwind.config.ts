import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0612",
        panel: "#150a22",
        accent: "#a855f7",
        accent2: "#ec4899",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 24px rgba(168,85,247,0.35)" },
          "50%": { boxShadow: "0 0 48px rgba(236,72,153,0.55)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        floaty: "floaty 4s ease-in-out infinite",
        glow: "glow 3s ease-in-out infinite",
        gradientShift: "gradientShift 12s ease infinite",
      },
    },
  },
  plugins: [],
};

export default config;
