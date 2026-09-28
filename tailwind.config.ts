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
        // Pure achromatic grayscale — absolute color rule: NO HUE
        obsidian: {
          950: "#050505", // Primary canvas
          900: "#0C0C0C", // Secondary background
          850: "#101010", // Panels & cards
          800: "#141414", // Elevated / hover
          750: "#202020", // Borders & separators
          700: "#303030", // Strong borders / active strokes
        },
        // "sand" mapped to pure neutral grays (no warm tone)
        sand: {
          100: "#F5F5F5", // Primary text / white button
          200: "#E5E5E5", // Active / selected
          300: "#AAAAAA", // Secondary text
          400: "#888888", // Medium metadata
          500: "#666666", // Muted
          850: "#282828", // Subtle borders
          900: "#101010", // Panel background
        },
        // Graph semantic colors — pure grayscale; differentiation via size/shape only
        graph: {
          victim:      "#DDDDDD", // White-gray outline
          suspect:     "#F5F5F5", // Bright white outline (larger node)
          intermediary:"#777777", // Medium gray
          bridge:      "#AAAAAA", // Light gray
          vasp:        "#CCCCCC", // Gray-white
        },
        // Mono utility scale
        mono: {
          950: "#050505",
          900: "#0C0C0C",
          850: "#101010",
          800: "#141414",
          750: "#202020",
          700: "#303030",
          600: "#383838",
          500: "#555555",
          400: "#777777",
          300: "#999999",
          200: "#CCCCCC",
          100: "#E5E5E5",
          50:  "#F5F5F5",
          0:   "#FFFFFF",
        },
      },
      borderRadius: {
        card:  "6px",
        input: "4px",
        btn:   "4px",
        badge: "4px",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        display: ["48px", { lineHeight: "52px", letterSpacing: "-0.02em" }],
        page:    ["28px", { lineHeight: "32px", letterSpacing: "-0.015em" }],
        section: ["16px", { lineHeight: "20px", letterSpacing: "-0.01em" }],
        body:    ["14px", { lineHeight: "20px" }],
        meta:    ["12px", { lineHeight: "16px" }],
        tech:    ["11px", { lineHeight: "15px", letterSpacing: "0.02em" }],
        micro:   ["10px", { lineHeight: "12px", letterSpacing: "0.03em" }],
      },
      boxShadow: {
        panel:    "0 12px 40px rgba(0,0,0,0.55)",
        card:     "none",
        dropdown: "0 8px 24px rgba(0,0,0,0.65)",
      },
      transitionTimingFunction: {
        monomer: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRadar: {
          '0%': { boxShadow: '0 0 0 0 rgba(245, 245, 245, 0.4)' },
          '70%': { boxShadow: '0 0 0 6px rgba(245, 245, 245, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(245, 245, 245, 0)' },
        },
        sweep: {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)', opacity: '0' },
          '50%': { opacity: '0.1' },
          '100%': { transform: 'translateX(200%) skewX(-15deg)', opacity: '0' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in-up-delay-1': 'fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards',
        'fade-in-up-delay-2': 'fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards',
        'fade-in-up-delay-3': 'fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards',
        'fade-in-up-delay-4': 'fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards',
        'pulse-radar': 'pulseRadar 2s infinite',
        'sweep': 'sweep 2.5s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
