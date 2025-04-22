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
          DEFAULT: '#6E59A5', // Deep purple
          foreground: '#ffffff',
          light: '#9b87f5', // Lighter purple
          dark: '#1A1F2C', // Dark purple, almost black
        },
        secondary: {
          DEFAULT: '#000000e6', // Black with slight transparency
          foreground: '#ffffff',
        },
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
        "soft-gray": "#F1F0FB",
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #6E59A5, #1A1F2C)',
      },
      boxShadow: {
        'event-card': '0 4px 15px rgba(126, 87, 194, 0.2)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
