const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
module.exports = [
  {
    ignores: [
      'node_modules/*',
      'dist/*',
      'coverage/*',
      '.vite/*',
      '.out/*',
      '.webpack/*',
      '*.js',
      'webpack.plugins.ts',
    ],
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
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  }),
];
