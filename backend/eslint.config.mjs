import globals from 'globals';
import pluginJs from '@eslint/js';
import nodePlugin from 'eslint-plugin-n';

export default [
  {
    files: ['**/*.js'],
    ignores: ['**/*.config.js'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'commonjs',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        console: 'readonly',
        __basedir: 'writable',
      },
    },
    plugins: {
      n: nodePlugin,
    },
    rules: {
      'no-console': 'warn', // Warn about console statements
      eqeqeq: 'error', // Enforce strict equality
      curly: 'warn', // Require following curly brace conventions
      'no-var': 'error', // Disallow using var
      'no-unused-vars': ['warn', { argsIgnorePattern: 'next' }], // Warn about unused variables
      'array-callback-return': ['error', { checkForEach: true }],
      'no-await-in-loop': 'warn',
      'no-cond-assign': 'error',
      'no-const-assign': 'error',
      'no-constant-condition': 'error',
      'no-dupe-args': 'error',
      'no-dupe-else-if': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-duplicate-imports': 'error',
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-use-before-define': 'error',
      'no-useless-assignment': 'error',
      'no-else-return': 'warn',
      'no-redeclare': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-destructuring': 'warn',
      'prefer-object-spread': 'warn',
      'require-await': 'error',
      'n/global-require': 'error',
    },
  },
  pluginJs.configs.recommended,
];
