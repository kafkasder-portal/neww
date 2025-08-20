import eslint from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    // Performance settings
    linterOptions: {
      reportUnusedDisableDirectives: false
    },
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'supabase/**',
      'e2e/**',
      'neww/**',
      'api/**',
      'migrations/**',
      'scripts/**',
      'docs/**',
      '*.html',
      '*.config.*',
      'test-*.js',
      'test-*.html',
      '.tsbuildinfo',
      'coverage/**',
      '**/*.d.ts'
    ],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React rules - Performance optimized
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/no-array-index-key': 'warn',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-unused-state': 'warn',
      'react/prefer-stateless-function': 'warn',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Import/Export optimization
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // TypeScript rules - Performance focused
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'off', // Use unused-imports instead
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/no-floating-promises': 'off', // Can be expensive
      '@typescript-eslint/no-misused-promises': 'off', // Can be expensive
      '@typescript-eslint/require-await': 'off', // Can be expensive
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',

      // General rules - Performance optimized
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-alert': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': 'error',
      'no-unused-vars': 'off', // Use unused-imports instead
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'warn',
      'prefer-template': 'warn',
    },
  },
  {
    files: ['**/*.test.{js,ts,tsx}', '**/*.spec.{js,ts,tsx}', '**/test/**/*'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-useless-escape': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.cjs', 'scripts/**/*', '**/build/**/*', '**/config/**/*', 'test-*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-undef': 'off',
    },
  }
);