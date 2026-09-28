import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        mono: {
          950: "#000000",
          900: "#0c0c0c",
          850: "#141414",
          800: "#1c1c1c",
          750: "#242424",
          700: "#2e2e2e",
          600: "#444444",
          500: "#666666",
          400: "#888888",
          300: "#aaaaaa",
          200: "#cccccc",
          100: "#e5e5e5",
          50: "#f5f5f5",
          0: "#ffffff",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      keyframes: {
        flowDash: {
          to: {
            strokeDashoffset: "-20",
          },
        },
      },
      animation: {
        "flow-dash": "flowDash 1.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
