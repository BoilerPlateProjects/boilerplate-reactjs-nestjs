/// <reference types="vitest" />
import { defineConfig } from "vite";

import pkgJson from "./package.json";

const external = [
  ...Object.keys(pkgJson.dependencies || {}),
  ...Object.keys(pkgJson.devDependencies || {}),
  /^node:/,
  /^react-dom(\/.*)?/,
  /^react(\/.*)?/
];

export default defineConfig({
  build: {
    outDir: "build",
    emptyOutDir: true,
    lib: {
      entry: { server: "./src/server.ts" },
      name: "server",
      fileName: "server",
      formats: ["es"]
    },
    rollupOptions: {
      external
    }
  },
  test: {}
});
