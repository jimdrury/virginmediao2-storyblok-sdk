import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "StoryblokSdk",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "esm" : "js"}`,
    },
    rollupOptions: {
      external: ["axios"],
      output: {
        globals: {
          axios: "axios",
        },
      },
    },
    sourcemap: true,
    outDir: "dist",
  },
  plugins: [
    dts({
      include: ["src/**/*"],
      exclude: ["src/**/*.spec.ts", "src/**/*.test.ts"],
      outDir: "dist",
    }),
  ],
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.ts"],
    exclude: ["node_modules", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.d.ts",
        "**/*.config.ts",
        "**/*.config.js",
        "**/coverage/**",
      ],
    },
  },
});
