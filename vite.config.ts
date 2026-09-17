import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const raiz = path.dirname(fileURLToPath(import.meta.url));
const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  build: {
    rollupOptions: {
      input: {
        main: path.join(raiz, "index.html"),
        overlay: path.join(raiz, "overlay.html"),
      },
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
});
