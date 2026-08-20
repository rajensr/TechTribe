// tailwind.config.ts
// DESIGN.md theke newa color palette, typography, spacing — poora design system ekhane define kora

import type { Config } from "tailwindcss";

const config: Config = {
  // Kon kon file e Tailwind class use hobe
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── COLOR PALETTE (DESIGN.md theke exact) ────────────────────────────
      colors: {
        // Primary blue — main CTA, active states, brand accent
        primary: {
          DEFAULT: "#003ec7",
          container: "#0052ff",
          dark: "#0038b6",
          tint: "#004ced",
        },
        // On-primary — primary button er text color
        "on-primary": "#ffffff",
        "on-primary-container": "#dfe3ff",
        "inverse-primary": "#b7c4ff",

        // Secondary — nav background, headings
        secondary: {
          DEFAULT: "#515f78",
          container: "#d2e0fe",
        },
        "on-secondary": "#ffffff",
        "on-secondary-container": "#55637d",

        // Tertiary — secondary text, metadata, icons
        tertiary: {
          DEFAULT: "#3f4f65",
          container: "#57677e",
        },
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#d6e6ff",

        // Surface layers — background hierarchy
        surface: {
          DEFAULT: "#f7f9fb",
          dim: "#d8dadc",
          bright: "#f7f9fb",
          lowest: "#ffffff",
          low: "#f2f4f6",
          DEFAULT2: "#eceef0",
          high: "#e6e8ea",
          highest: "#e0e3e5",
        },
        "on-surface": "#191c1e",
        "on-surface-variant": "#434656",
        "inverse-surface": "#2d3133",
        "inverse-on-surface": "#eff1f3",

        // Outline — borders
        outline: {
          DEFAULT: "#737688",
          variant: "#c3c5d9",
        },

        // Error states
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        // Background
        background: "#f7f9fb",
        "on-background": "#191c1e",

        // Fixed palette
        "primary-fixed": "#dde1ff",
        "primary-fixed-dim": "#b7c4ff",
        "on-primary-fixed": "#001452",
        "secondary-fixed": "#d6e3ff",
        "secondary-fixed-dim": "#b9c7e4",
        "tertiary-fixed": "#d3e4fe",
        "tertiary-fixed-dim": "#b7c8e1",
      },

      // ─── TYPOGRAPHY ────────────────────────────────────────────────────────
      fontFamily: {
        // Geist — headline and body (DESIGN.md)
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        // JetBrains Mono — labels, tags, metadata (DESIGN.md)
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        // Display large — hero headings
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        // Headline sizes
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        // Body text
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        // Label — JetBrains Mono e use korte hobe manually
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }],
        // Button text
        btn: ["14px", { lineHeight: "20px", fontWeight: "600" }],
      },

      // ─── BORDER RADIUS (DESIGN.md shape language) ──────────────────────────
      borderRadius: {
        sm: "0.125rem",   // 2px
        DEFAULT: "0.25rem", // 4px — buttons, inputs
        md: "0.375rem",   // 6px
        lg: "0.5rem",     // 8px — cards
        xl: "0.75rem",    // 12px
        full: "9999px",   // pill — badges, tags
      },

      // ─── SPACING ───────────────────────────────────────────────────────────
      spacing: {
        "4px": "4px",
        xs: "0.5rem",   // 8px
        sm: "1rem",     // 16px
        md: "1.5rem",   // 24px — component internal padding
        lg: "2.5rem",   // 40px
        xl: "4rem",     // 64px — section gaps
        gutter: "24px",
        "margin-mobile": "16px",
        "margin-desktop": "48px",
        "max-w": "1280px",
      },

      // ─── MAX WIDTH ─────────────────────────────────────────────────────────
      maxWidth: {
        container: "1280px",
      },

      // ─── BOX SHADOW (elevation system from DESIGN.md) ──────────────────────
      boxShadow: {
        // Level 0 — no shadow (rest state)
        none: "none",
        // Level 2 — card hover state
        card: "0 12px 24px -10px rgba(10, 25, 47, 0.08)",
        // Level 3 — modals, overlays
        modal: "0 20px 48px -12px rgba(10, 25, 47, 0.12)",
      },

      // ─── BACKDROP BLUR — navbar glassmorphism ─────────────────────────────
      backdropBlur: {
        nav: "12px",
      },

      // ─── KEYFRAME ANIMATIONS ──────────────────────────────────────────────
      keyframes: {
        // Smooth fade in — cards, modals er entrance
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Pulse animation — loading skeleton er jonno
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        // Slide in from top — navbar er jonno
        "slide-down": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out forwards",
        shimmer: "shimmer 1.5s infinite linear",
        "slide-down": "slide-down 0.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
