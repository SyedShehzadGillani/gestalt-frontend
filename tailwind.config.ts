import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        sans: ['Gotham', 'Montserrat', 'system-ui', 'sans-serif'],
        gotham: ['Gotham', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(var(--background))",
          secondary: "hsl(var(--background-secondary))",
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          secondary: "hsl(var(--foreground-secondary))",
          muted: "hsl(var(--foreground-muted))",
        },
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
          hover: "hsl(var(--card-hover))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          highlight: "hsl(var(--gold-highlight))",
          dimlight: "hsl(var(--gold-dimlight))",
          dim: "hsl(var(--gold-dim))",
        },
        "gray-blue": {
          DEFAULT: "hsl(var(--gray-blue))",
        },
        spectrum: {
          liquidation: "hsl(var(--spectrum-liquidation))",
          "exit-unlikely": "hsl(var(--spectrum-exit-unlikely))",
          disruption: "hsl(var(--spectrum-disruption))",
          vulnerable: "hsl(var(--spectrum-vulnerable))",
          "exit-possible": "hsl(var(--spectrum-exit-possible))",
          "exit-ready": "hsl(var(--spectrum-exit-ready))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          dim: "hsl(var(--green-dim))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          dim: "hsl(var(--orange-dim))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          dim: "hsl(var(--blue-dim))",
        },
        purple: {
          DEFAULT: "hsl(var(--purple))",
          dim: "hsl(var(--purple-dim))",
        },
        red: {
          DEFAULT: "hsl(var(--red))",
          dim: "hsl(var(--red-dim))",
        },
        "hq-purple": {
          DEFAULT: "hsl(var(--hq-purple))",
          dim: "hsl(var(--hq-purple-dim))",
        },
        hive: {
          magenta: "hsl(var(--hive-magenta))",
          "magenta-dim": "hsl(var(--hive-magenta-dim))",
          orange: "hsl(var(--hive-orange))",
          "orange-dim": "hsl(var(--hive-orange-dim))",
          blue: "hsl(var(--hive-blue))",
          "blue-dim": "hsl(var(--hive-blue-dim))",
          yellow: "hsl(var(--hive-yellow))",
          "yellow-dim": "hsl(var(--hive-yellow-dim))",
          white: "hsl(var(--hive-white))",
          "white-dim": "hsl(var(--hive-white-dim))",
        },
        dashboard: {
          bg: "hsl(var(--dashboard-bg))",
          card: "hsl(var(--dashboard-card))",
          accent: "hsl(var(--dashboard-accent))",
          text: "hsl(var(--dashboard-text))",
          "text-muted": "hsl(var(--dashboard-text-muted))",
          border: "hsl(var(--dashboard-border))",
        },
        chart: {
          primary: "hsl(var(--chart-primary))",
          secondary: "hsl(var(--chart-secondary))",
          success: "hsl(var(--chart-success))",
          warning: "hsl(var(--chart-warning))",
          error: "hsl(var(--chart-error))",
          accent: "hsl(var(--chart-accent))",
          muted: "hsl(var(--chart-muted))",
        },
        employee: {
          declining: "hsl(var(--employee-declining))",
          "declining-dark": "hsl(var(--employee-declining-dark))",
        },
        quadrant: {
          personal: "hsl(var(--q-personal))",
          staff: "hsl(var(--q-staff))",
          patient: "hsl(var(--q-patient))",
          knowledge: "hsl(var(--q-knowledge))",
        },
        frame: {
          DEFAULT: "hsl(var(--frame-bg))",
          border: "hsl(var(--frame-border))",
          header: "hsl(var(--frame-header-bg))",
        },
      },
      boxShadow: {
        card: "var(--shadow-card)",
        elevated: "var(--shadow-elevated)",
      },
      borderRadius: {
        lg: "2px",
        md: "2px",
        sm: "2px",
        none: "0",
      },
      spacing: {
        'nav': 'var(--nav-height)',
        'sidebar': 'var(--sidebar-width)',
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
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
