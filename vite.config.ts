/// <reference types="vitest/config" />
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { playwright } from '@vitest/browser-playwright'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // P0-5 FIX: explicit allowlist instead of a blanket allowed-host policy.
    allowedHosts: ['localhost', '127.0.0.1', '.manus.computer'],
    proxy: {
      // Keep the only externally exposed port on 5173. The API stays private
      // on localhost:3000 and Vite forwards REST + Swagger requests to it.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      // Same-port realtime notifications for the browser client.
      '/notifications': {
        target: 'ws://localhost:3000',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    silent: 'passed-only',
    unstubEnvs: true,
    // Baseline defect: a nested git worktree (`.kilo/worktrees/**`) and the
    // workspace build outputs were being collected as test files, so foreign
    // copies of the suite ran and failed here.
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.kilo/**',
      '**/apps/**',
      '**/packages/**',
    ],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
    coverage: {
      // include: ['src/**/*.{js,jsx,ts,tsx}'], // Uncomment to expand the report to all src/**/* so untested modules appear as 0% coverage.
      exclude: [
        'src/components/ui/**',
        'src/assets/**',
        'src/tanstack-table.d.ts',
        'src/routeTree.gen.ts',
        'src/test-utils/**',
        'src/routes/**',
      ],
    },
  },
})
