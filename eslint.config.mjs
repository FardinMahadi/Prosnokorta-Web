import globals from 'globals';
import eslintJs from '@eslint/js';
import eslintTs from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

/**
 * @rules common
 */
const commonRules = () => ({
  ...reactHooksPlugin.configs.recommended.rules,
  'func-names': 1,
  'no-bitwise': 2,
  'object-shorthand': 1,
  'no-useless-rename': 1,
  'default-case-last': 2,
  'consistent-return': 2,
  'no-constant-condition': 1,
  'default-case': [2, { commentPattern: '^no default$' }],
  'arrow-body-style': [2, 'as-needed'],
  
  // React
  'react/jsx-key': 2,
  'react/self-closing-comp': 2,
  'react/react-in-jsx-scope': 0, // Not needed in modern React
  'react/jsx-no-useless-fragment': [1, { allowExpressions: true }],
  'react/jsx-curly-brace-presence': [2, { props: 'never', children: 'never' }],
  
  // Disable standard unused vars to let unused-imports plugin handle it exclusively
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': 'off',
  '@typescript-eslint/no-shadow': 2,
  '@typescript-eslint/consistent-type-imports': [1, { prefer: 'type-imports' }],
});

/**
 * @rules unused imports
 */
const unusedImportsRules = () => ({
  'unused-imports/no-unused-imports': 1,
  'unused-imports/no-unused-vars': [
    'warn',
    { 
      vars: 'all', 
      varsIgnorePattern: '^_', 
      args: 'after-used', 
      argsIgnorePattern: '^_' 
    },
  ],
});

const sortImportsRules = () => ({
  'perfectionist/sort-imports': [
    2,
    {
      type: 'line-length',
      order: 'asc',
      ignoreCase: true,
      newlinesBetween: 1,
      groups: [
        'type',
        ['builtin', 'external'],
        'internal',
        ['parent', 'sibling', 'index'],
        'side-effect',
        'style',
      ],
    },
  ],
});

export const customConfig = {
  plugins: {
    'react-hooks': reactHooksPlugin,
    'unused-imports': unusedImportsPlugin,
    perfectionist: perfectionistPlugin,
    import: importPlugin,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
    react: { version: 'detect' },
  },
  rules: {
    ...commonRules(),
    ...importPlugin.configs.recommended.rules,
    ...unusedImportsRules(),
    ...sortImportsRules(),
    'import/no-cycle': 0, // Usually too slow for dev, enable only in CI
    'import/newline-after-import': 2,
  },
};

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { ignores: ['node_modules/', '.next/', 'dist/', 'build/', '.agents/'] },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  eslintJs.configs.recommended,
  ...eslintTs.configs.recommended,
  reactPlugin.configs.flat.recommended,
  customConfig,
];