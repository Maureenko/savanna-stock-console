import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Override default ignores of eslint-config-next
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'node_modules/**']),
  {
    // Custom rules - these are intentionally chosen, not just defaults
    rules: {
      // Enforce consistent imports
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Prevent unused variables but allow underscore prefix for intentionally unused
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Enforce consistent function types
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      // Require explicit return types on exported functions for better documentation
      '@typescript-eslint/explicit-function-return-type': 'off', // Disabled: TypeScript inference is sufficient for this project

      // Allow console.warn and console.error for debugging, but not console.log
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // React specific
      'react/self-closing-comp': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

      // Accessibility
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',

      // Prevent common mistakes
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: 'Prefer absolute imports using @/ alias',
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
