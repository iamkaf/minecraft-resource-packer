const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: ['eslint.config.js'],
  },
  js.configs.recommended,
  ...compat.config({
    env: {
      browser: true,
      es6: true,
      node: true,
    },
    extends: [
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/recommended',
      'plugin:import/electron',
      'plugin:import/typescript',
    ],
    parser: '@typescript-eslint/parser',
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  }),
];
