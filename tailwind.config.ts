import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        width: "width",
      },
      fontFamily: {},
      screens: {
        "2sm": "481px",
        "max-2sm": {
          max: "480px",
        },
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "max-sm": {
          max: "640px",
        },
        "max-md": {
          max: "768px",
        },
        "max-lg": {
          max: "1024px",
        },
        "max-xl": {
          max: "1280px",
        },
        "max-2xl": {
          max: "1536px",
        },
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(var(--background))",
          secondary: "hsl(var(--background-secondary))",
          hover: "hsl(var(--background-hover))",
          "story-area": "hsl(var(--story-area))",
          "story-card": "hsl(var(--story-card))",
          "story-arrow": "hsl(var(--story-arrow))",
        },
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          soft: {
            DEFAULT: "hsl(var(--primary-soft))",
            foreground: "hsl(var(--primary-soft-foreground))",
          },
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          hover: "hsl(var(--secondary-hover))",
          soft: {
            DEFAULT: "hsl(var(--secondary-soft))",
            foreground: "hsl(var(--secondary-soft-foreground))",
          },
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
          hover: "hsl(var(--tertiary-hover))",
          soft: {
            DEFAULT: "hsl(var(--tertiary-soft))",
            foreground: "hsl(var(--tertiary-soft-foreground))",
          },
        },
        terciary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
          hover: "hsl(var(--tertiary-hover))",
          soft: {
            DEFAULT: "hsl(var(--tertiary-soft))",
            foreground: "hsl(var(--tertiary-soft-foreground))",
          },
        },
        quaternary: {
          DEFAULT: "hsl(var(--quaternary))",
          foreground: "hsl(var(--quaternary-foreground))",
          hover: "hsl(var(--quaternary-hover))",
          soft: {
            DEFAULT: "hsl(var(--quaternary-soft))",
            foreground: "hsl(var(--quaternary-soft-foreground))",
          },
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          hover: "hsl(var(--destructive-hover))",
          soft: {
            DEFAULT: "hsl(var(--destructive-soft))",
            foreground: "hsl(var(--destructive-soft-foreground))",
          },
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          hover: "hsl(var(--warning-hover))",
          soft: {
            DEFAULT: "hsl(var(--warning-soft))",
            foreground: "hsl(var(--warning-soft-foreground))",
          },
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
          hover: "hsl(var(--info-hover))",
          soft: {
            DEFAULT: "hsl(var(--info-soft))",
            foreground: "hsl(var(--info-soft-foreground))",
          },
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          hover: "hsl(var(--success-hover))",
          soft: {
            DEFAULT: "hsl(var(--success-soft))",
            foreground: "hsl(var(--success-soft-foreground))",
          },
        },
        neutral: {
          DEFAULT: "hsl(var(--neutral))",
          foreground: "hsl(var(--neutral-foreground))",
          hover: "hsl(var(--neutral-hover))",
          soft: {
            DEFAULT: "hsl(var(--neutral-soft))",
            foreground: "hsl(var(--neutral-soft-foreground))",
          },
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
          secondary: {
            DEFAULT: "hsl(var(--card-secondary))",
            foreground: "hsl(var(--card-secondary-foreground))",
          },
          darker: "hsl(var(--neutral-darker))",
        },
        "neutral-dark": {
          DEFAULT: "hsl(var(--neutral-mid-dark))",
        },
        "icon-light": {
          DEFAULT: "hsl(var(--icon-light))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        miniSectionBackgroundTexture: "url(/img/miniSectionBackgroundTexture.svg)",
        "hero-gradient":
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000",
      },
      animation: {
        scroll: "scroll 40s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "canopy-horizontal": "canopy-x var(--duration) infinite linear",
        "canopy-vertical": "canopy-y var(--duration) linear infinite",
        "spin-color-blobs": "spinColorBlobs 8s linear infinite",
        "slow-spin": "slow-spin 5s linear infinite",
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        scroll: {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(calc(-250px * 14))",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "canopy-x": {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(calc(-100% - var(--gap)))",
          },
        },
        "canopy-y": {
          from: {
            transform: "translateY(0)",
          },
          to: {
            transform: "translateY(calc(-100% - var(--gap)))",
          },
        },
        spinColorBlobs: {
          "0%": { transform: "translate(-50%, -50%) rotate(0deg) scale(2)" },
          "100%": { transform: "translate(-50%, -50%) rotate(1turn) scale(2)" },
        },
        "slow-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        aurora: {
          "0%": { backgroundPosition: "50% 50%, 50% 50%" },
          "100%": { backgroundPosition: "350% 50%, 350% 50%" },
        },
      },
      fontSize: {
        "display-01": "7.5rem",
        "display-02": "3.75rem",
        "heading-01": "3.5rem",
        "heading-02": "3rem",
        "heading-03": "2.25rem",
        "heading-04": "1.75rem",
        "heading-05": "1.5rem",
        "body-title": "1.25rem",
        "body-paragraph": "1rem",
        "body-callout": "0.875rem",
        "body-caption": "0.75rem",
      },
      fontWeight: {
        light: "300",
        medium: "500",
        bold: "700",
      },
    },
  },
  plugins: [
    animatePlugin,
    function ({ addUtilities }: any) {
      const newUtilities = {
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          scrollbarColor: "hsl(var(--rev-azul-principal))",
        },
        ".scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "hsl(var(--rev-azul-principal))",
            borderRadius: "20px",
            border: "1px solid white",
          },
        },
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
        ".scrollbar-default": {
          "-ms-overflow-style": "auto",
          "scrollbar-width": "auto",
          "&::-webkit-scrollbar": { display: "block" },
        },
        ".display-01": { fontWeight: "700", fontSize: "7.5rem", lineHeight: "1.1" },
        ".display-02": { fontWeight: "700", fontSize: "3.75rem", lineHeight: "1.15" },
        ".heading-01": { fontWeight: "700", fontSize: "3.5rem", lineHeight: "1.2" },
        ".heading-02-bold": { fontWeight: "700", fontSize: "3rem", lineHeight: "1.2" },
        ".heading-02-medium": { fontWeight: "500", fontSize: "3rem", lineHeight: "1.2" },
        ".heading-02": { fontWeight: "400", fontSize: "3rem", lineHeight: "1.2" },
        ".heading-02-light": { fontWeight: "300", fontSize: "3rem", lineHeight: "1.2" },
        ".heading-03-bold": { fontWeight: "700", fontSize: "2.25rem", lineHeight: "1.2" },
        ".heading-03-medium": { fontWeight: "500", fontSize: "2.25rem", lineHeight: "1.2" },
        ".heading-03": { fontWeight: "400", fontSize: "2.25rem", lineHeight: "1.2" },
        ".heading-04-bold": { fontWeight: "700", fontSize: "1.75rem", lineHeight: "1.2" },
        ".heading-04-medium": { fontWeight: "500", fontSize: "1.75rem", lineHeight: "1.2" },
        ".heading-04": { fontWeight: "400", fontSize: "1.75rem", lineHeight: "1.2" },
        ".heading-04-light": { fontWeight: "300", fontSize: "1.75rem", lineHeight: "1.2" },
        ".heading-05-bold": { fontWeight: "700", fontSize: "1.5rem", lineHeight: "1.2" },
        ".heading-05-medium": { fontWeight: "500", fontSize: "1.5rem", lineHeight: "1.2" },
        ".heading-05": { fontWeight: "400", fontSize: "1.5rem", lineHeight: "1.2" },
        ".heading-05-light": { fontWeight: "300", fontSize: "1.5rem", lineHeight: "1.2" },
        ".body-title-bold": { fontWeight: "700", fontSize: "1.25rem", lineHeight: "1.2" },
        ".body-title-medium": { fontWeight: "500", fontSize: "1.25rem", lineHeight: "1.2" },
        ".body-title": { fontWeight: "400", fontSize: "1.25rem", lineHeight: "1.2" },
        ".body-title-light": { fontWeight: "300", fontSize: "1.25rem", lineHeight: "1.2" },
        ".body-paragraph-bold": { fontWeight: "700", fontSize: "1rem", lineHeight: "1.2" },
        ".body-paragraph-medium": { fontWeight: "500", fontSize: "1rem", lineHeight: "1.2" },
        ".body-paragraph": { fontWeight: "400", fontSize: "1rem", lineHeight: "1.2" },
        ".body-paragraph-light": { fontWeight: "300", fontSize: "1rem", lineHeight: "1.2" },
        ".body-callout-bold": { fontWeight: "700", fontSize: "0.875rem", lineHeight: "1.2" },
        ".body-callout-medium": { fontWeight: "500", fontSize: "0.875rem", lineHeight: "1.2" },
        ".body-callout": { fontWeight: "400", fontSize: "0.875rem", lineHeight: "1.2" },
        ".body-callout-light": { fontWeight: "300", fontSize: "0.875rem", lineHeight: "1.2" },
        ".body-caption-bold": { fontWeight: "700", fontSize: "0.75rem", lineHeight: "1.2" },
        ".body-caption-medium": { fontWeight: "500", fontSize: "0.75rem", lineHeight: "1.2" },
        ".body-caption": { fontWeight: "400", fontSize: "0.75rem", lineHeight: "1.2" },
        ".body-caption-light": { fontWeight: "300", fontSize: "0.75rem", lineHeight: "1.2" },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};

export default config;
