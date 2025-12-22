import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./wp-theme/sorena/**/*.{php,js}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    extend: {
      fontFamily: {
        vazir: ["Vazirmatn", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
          DEFAULT: "hsl(var(--muted))",
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
        sorena: {
          primary: "#6366FF",
          secondary: "#C084FC",
          accent: "#22D3EE",
          coral: "#FB7185",
          success: "#10B981",
          warning: "#F97316",
          info: "#3B82F6",
          dark: {
            bg: "#020617",
            elevated: "#0F172A",
          },
          light: {
            bg: "#F9FAFB",
            elevated: "#E5E7EB",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "1.75rem",
        pill: "9999px",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      fontSize: {
        "display": ["3.5rem", { lineHeight: "4rem", fontWeight: "700" }],
        "display-sm": ["2.75rem", { lineHeight: "3.25rem", fontWeight: "700" }],
      },
      boxShadow: {
        "glass": "0 8px 32px rgba(0, 0, 0, 0.12)",
        "glass-dark": "0 8px 32px rgba(0, 0, 0, 0.4)",
        "card": "0 18px 40px rgba(15, 23, 42, 0.14)",
        "card-dark": "0 18px 40px rgba(15, 23, 42, 0.35)",
        "modal": "0 24px 60px rgba(15, 23, 42, 0.55)",
        "glow-primary": "0 0 20px rgba(99, 102, 241, 0.3)",
        "glow-accent": "0 0 20px rgba(34, 211, 238, 0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(99, 102, 241, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.6)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 1.5s infinite",
      },
      transitionTimingFunction: {
        "sorena": "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
