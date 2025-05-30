import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'gooddog': ['Good Dog', 'cursive'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(270 80% 60%)', 
          foreground: 'hsl(var(--primary-foreground))',
          light: 'hsl(270 70% 75%)',
          dark: 'hsl(270 80% 45%)'
        },
        secondary: {
          DEFAULT: 'hsl(210 80% 60%)', 
          foreground: 'hsl(var(--secondary-foreground))',
          light: 'hsl(210 70% 75%)',
          dark: 'hsl(210 80% 45%)'
        },
        "secondary-purple": "#7E69AB",
        "tertiary-purple": "#6E59A5",
        "dark-purple": "#1A1F2C",
        "charcoal-gray": "#403E43",
        destructive: {
          DEFAULT: '#ea384c', 
          foreground: '#ffffff', 
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        "dashboard-bg": "#FFFFFF",
        "dashboard-card": "#F1F0FB",
        "dashboard-text": "#000000",
        "dashboard-muted": "#666666",
        "soft-purple": "#E5DEFF",
        "soft-pink": "#FFDEE2",
        "soft-peach": "#FDE1D3", 
        "soft-blue": "#D3E4FD",
        "soft-green": "#F2FCE2",
        "soft-yellow": "#FEF7CD",
        "soft-orange": "#FEC6A1",
        "soft-gray": "#f3f3f3",
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, hsl(270 80% 60%), hsl(210 80% 60%))',
      },
      boxShadow: {
        'event-card': '0 4px 15px rgba(126, 87, 194, 0.2)'
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        shine: {
          '0%': { left: '-100%' },
          '100%': { left: '200%' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shine": "shine 2s ease-in-out infinite",
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
