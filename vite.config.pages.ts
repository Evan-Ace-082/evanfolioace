// Static build config used ONLY for GitHub Pages deployment.
// It does not affect the normal Lovable build (vite.config.ts).
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: process.env.PAGES_BASE ?? "/My-Portfolio/",
  root: fileURLToPath(new URL("./gh-pages", import.meta.url)),
  plugins: [tsconfigPaths({ projects: ["./tsconfig.json"] }), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: fileURLToPath(new URL("./dist-pages", import.meta.url)),
    emptyOutDir: true,
  },
});
