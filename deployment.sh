#!/bin/bash
set -e  # Exit immediately if a command fails

# Clean up previous build
rm -rf dist

# Build the client
cd client
npm install
mkdir -p shared
cp -r ../shared/* ./shared/ || true

# Create necessary directories for missing components
mkdir -p src/components/ui

# Create a placeholder toaster component
cat > src/components/ui/toaster.tsx << 'EOL'
import React from "react";

export function Toaster() {
  return null;
}

export { useToast } from "../../../src/hooks/use-toast";
export { toast } from "../../../src/hooks/use-toast";
EOL

# Create tailwind.config.js
cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        rubik: ["Rubik", "sans-serif"],
        caveat: ["Caveat", "cursive"],
        permanent: ["Permanent Marker", "cursive"],
        rock: ["Rock Salt", "cursive"],
        indie: ["Indie Flower", "cursive"],
        shadows: ["Shadows Into Light", "cursive"],
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
EOL

# Create postcss.config.js
cat > postcss.config.js << 'EOL'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOL

# Create a simple vite.config.js in the client directory
cat > vite.config.js << 'EOL'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});
EOL

# Run build with more verbose output
echo "Starting Vite build..."
npx vite build || { echo "Build failed"; cat src/App.tsx; exit 1; }
echo "Build completed successfully"

# Move back to root
cd .. 