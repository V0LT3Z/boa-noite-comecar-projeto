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
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(270 80% 60%)', // Roxo vibrante
          foreground: 'hsl(var(--primary-foreground))',
          light: 'hsl(270 70% 75%)',
          dark: 'hsl(270 80% 45%)'
        },
        secondary: {
          DEFAULT: 'hsl(210 80% 60%)', // Azul jovem
          foreground: 'hsl(var(--secondary-foreground))',
          light: 'hsl(210 70% 75%)',
          dark: 'hsl(210 80% 45%)'
        },
        destructive: {
          DEFAULT: '#ea384c', // Solid red color for error messages
          foreground: '#ffffff', // White text for high contrast
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        "dashboard-bg": "#1A1A1A",
        "dashboard-card": "#2A2A2A",
        "dashboard-text": "#FFFFFF",
        "dashboard-muted": "#999999",
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, hsl(270 80% 60%), hsl(210 80% 60%))',
      },
      boxShadow: {
        'event-card': '0 4px 15px rgba(126, 87, 194, 0.2)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
