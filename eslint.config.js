import pluginVue from 'eslint-plugin-vue';
import pluginPrettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default [
  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      '*.config.js',
      'data/broken/**',
    ],
  },

  // Vue files
  ...pluginVue.configs['flat/recommended'],

  // Prettier config (disables conflicting ESLint rules)
  configPrettier,

  // General JavaScript rules
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',

      // Best practices from copilot-instructions.md
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Vue specific
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'error',
      'vue/require-prop-types': 'error',

      // Code quality
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-debugger': 'error',
    },
  },
];
