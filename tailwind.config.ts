import type { Config } from "tailwindcss";

const config: Config = {
  // Scan the application source first so future feature folders inherit the same setup.
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        border: "var(--border)",
        accent: "var(--accent)",
        muted: "var(--muted-foreground)",
      },
    },
  },
  plugins: [],
};

export default config;
