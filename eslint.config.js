import pluginVue from "eslint-plugin-vue";

export default [
  // Ignore patterns
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**", "*.config.js"],
  },

  // Vue files
  ...pluginVue.configs["flat/recommended"],

  // General JavaScript rules
  {
    rules: {
      // Best practices from copilot-instructions.md
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Vue specific
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "warn",
      "vue/require-default-prop": "error",
      "vue/require-prop-types": "error",

      // Code quality
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-debugger": "error",
    },
  },
];
