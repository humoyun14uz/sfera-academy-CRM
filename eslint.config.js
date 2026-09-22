
import globals from 'globals'
import js from '@eslint/js'
import pluginQuery from '@tanstack/eslint-plugin-query'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
  {
    ignores: [
      'dist',
      '**/dist/**',
      'src/components/ui',
      'node_modules',
      'coverage',
      // Nested git worktrees must never be linted (they contain a foreign
      // copy of the project and would duplicate every finding).
      '.kilo/worktrees/**',
      'src/routeTree.gen.ts',
    ],
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...pluginQuery.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,

      // ESLint uchun loyiha ildizini aniq belgilash
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-console': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
          disallowTypeAnnotations: false,
        },
      ],

      'no-duplicate-imports': 'error',
    },
  },
  {
    files: ['src/api/**/*.ts'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    // Backend workspace packages run on Node.js, not in the browser.
    files: ['apps/**/*.ts', 'packages/**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-console': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-duplicate-imports': 'error',
      // NestJS resolves injected services/guards through `design:paramtypes`
      // metadata emitted at compile time. That metadata only carries a class
      // reference when the class is imported as a VALUE, so `import type` here
      // silently breaks dependency injection (AuthService, all *Service
      // injections, Reflector in guards, ...). For the backend we therefore
      // require plain value imports for everything.
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'no-type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },
  {
    // CLI scripts legitimately write to stdout/stderr.
    files: ['packages/db/src/seed.ts', 'packages/db/src/migrate.ts'],
    rules: { 'no-console': 'off' },
  },
  {
    // Config files, tests and scripts commonly need console output.
    files: ['**/*.{test,spec}.{ts,tsx}', '**/vitest.config.ts', '**/*.config.js'],
    rules: { 'no-console': 'off' },
  }
)
