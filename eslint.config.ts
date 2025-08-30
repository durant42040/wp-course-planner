import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  globalIgnores([
    "src/components/ui",
    "node_modules/**",
    "dist/**",
    "public/**",
    "*.config.js",
    "*.config.ts",
  ]),
]);
