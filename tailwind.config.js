/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0e1117",
        foreground: "#fafafa",
        card: {
          DEFAULT: "#1e2130",
          foreground: "#fafafa",
        },
        primary: {
          DEFAULT: "#667eea",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#764ba2",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#1e2130",
          foreground: "#a0a0a0",
        },
        accent: {
          DEFAULT: "#667eea",
          foreground: "#ffffff",
        },
        border: "rgba(102, 126, 234, 0.2)",
        input: "rgba(102, 126, 234, 0.1)",
        ring: "#667eea",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};
