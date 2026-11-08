import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  // Expose both VITE_* (Vite default) and EXPO_PUBLIC_* (Rork's cross-platform
  // public-env convention, written by tools like getOrCreateAuthConfig).
  envPrefix: ["VITE_", "EXPO_PUBLIC_"],
  // Static multi-page marketing site (mirrors site/).
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(import.meta.dirname, "index.html"),
        about: path.resolve(import.meta.dirname, "about.html"),
        privacy: path.resolve(import.meta.dirname, "privacy.html"),
        support: path.resolve(import.meta.dirname, "support.html"),
      },
    },
  },
}));
