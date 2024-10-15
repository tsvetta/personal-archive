module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  settings: {
    'import/resolver': {
      // You will also need to install and configure the TypeScript resolver
      // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
      typescript: true,
      node: true,
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'import/no-cycle': 'error',
    'import/no-named-as-default-member': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
};
