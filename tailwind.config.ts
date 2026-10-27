import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "var(--background-color)",
        foreground: "var(--foreground-color)",
        "dark-foreground": "#fff7f0",
        "accent-teal": "#48bcce",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "var(--muted-color)",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sand: {
          DEFAULT: "#F0EDE5",
          50: "#FAFAF8",
          100: "#F7F5F0",
          200: "#F0EDE5",
          300: "#E5E0D6",
          400: "#D4CEC2",
          500: "#B8B0A2",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        geistMono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        geistSans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        playfairDisplay: ["var(--font-playfair-display)", "Georgia", "serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        blink: "blink 1.05s steps(2, start) infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
