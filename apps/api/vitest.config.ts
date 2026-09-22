import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.spec.ts', 'src/**/*.spec.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['dist/**', 'node_modules/**'],
    },
  },
})

