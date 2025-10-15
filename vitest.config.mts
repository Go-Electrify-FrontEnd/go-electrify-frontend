import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      all: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "node_modules/",
        "test/",
        "dist/",
        "src/**/*.d.ts",
        "src/**/index.{ts,tsx}",
        "src/{types,styles,assets}/**",
        "src/**/stories.{ts,tsx,js,jsx}",
        "src/**/__tests__/**",
      ],
    },
  },
});
