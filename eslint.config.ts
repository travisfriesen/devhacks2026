import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
//@ts-expect-error I'm not planning on fixing these imports, doesn't cause any issues when linting
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{ts,mts,cts,tsx}"],
        plugins: {
            js,
            "@typescript-eslint": tseslint.plugin,
        },
        settings: {
            react: { version: "detect" },
        },
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            eslintPluginPrettierRecommended,
        ],
        languageOptions: {
            parserOptions: {
                ecmaVersion: "latest",
            },
            globals: globals.browser,
        },
    },
]);
