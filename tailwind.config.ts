import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#F2FAF4", // Light background (unchanged)
          foreground: "#1A3C34", // Dark text (unchanged)
          primary: "#452FAB", // Dark blue (cosmic primary)
          secondary: "#344699", // Dark blue gradient middle (cosmic secondary)
          accent: "#d4af37", // Dark green (unchanged, but can be adjusted if needed)
          "secondary-disabled": "#B8E3C4", // Disabled state (unchanged)
          border: "#FFFFFF10", // Light border opacity
          shadow: "#92E3A920", // Light shadow opacity
        },
        dark: {
          background: "#0D1117", // Dark blue gradient start (cosmic primary)
          foreground: "#E6F7EB", // Light text (unchanged)
          primary: "#452FAB", // Dark blue (cosmic primary)
          secondary: "#344699", // Dark blue gradient middle (cosmic secondary)
          accent: "#d4af37", // Dark green (unchanged, but can be adjusted if needed)
          "secondary-disabled": "#3A554A", // Disabled state (unchanged)
          border: "#FFFFFF30", // Dark border opacity
          shadow: "#6BBF8440", // Dark shadow opacity
        },
      },
      fontFamily: {
        dancing: ["Dancing Script", "serif"],
        stix: ["STIX Two Text", "serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translate(-50%, -50%) scale(0.9)" },
          "100%": { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
  darkMode: "class",
};

export default config;
