module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
    jasmine: true,
    jest: true,
    node: true,
  },
  // Airbnb's ESLint config requires this
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname
  },
  rules: {
    // Include .prettierrc.js rules
    'prettier/prettier': ['error', {usePrettierrc: true}],
    // Turn off this rule because redux state updating is immutable
    'no-param-reassign': 'off',
    // We don't want unused vars
    '@typescript-eslint/no-unused-vars': [ 'off' ],
    '@typescript-eslint/naming-convention': [ 'off' ],
  },
}
