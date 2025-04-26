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
          text: {
            primary: "",
            secondary: "",
          },
        },
        dark: {
          background: "#0B1026", // Matches the gradient start from SignupPage
          foreground: "#F0E6FF", // Light text color similar to form text
          primary: "#4F46E5", // Purple-blue from the gradient (between blue-400 and purple-400)
          secondary: "#1B2349", // Matches the gradient middle from SignupPage
          accent: "#38BDF8", // Kept the bright sky blue as it works well
          "secondary-disabled": "#3A2E4F", // Adjusted to match the dark purple tones
          border: "#FFFFFF10", // Matches the form input borders
          shadow: "#4F46E520", // Using primary color with opacity for glow
          text: {
            primary: "#FFFFFF", // Pure white like form text
            secondary: "#D1C4E9", // Light purple like secondary text
          },
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
