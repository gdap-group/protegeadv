import { defineWorkspace } from 'vitest/config'
import path from 'path'

export default defineWorkspace([
  {
    test: {
      name: 'web',
      root: './apps/web',
      environment: 'jsdom',
      include: ['./src/**/*.test.{ts,tsx}'],
      exclude: ['./dist/**', '**/node_modules/**'],
      setupFiles: [path.resolve(import.meta.dirname, './apps/web/src/test/setup.ts')],
    },
  },
  {
    test: {
      name: 'worker',
      root: './apps/worker',
      environment: 'node',
      include: ['./src/**/*.test.ts'],
      exclude: ['./dist/**', '**/node_modules/**'],
    },
  },
  {
    test: {
      name: 'shared',
      root: './packages/shared',
      environment: 'node',
      include: ['./src/**/*.test.ts'],
      exclude: ['./dist/**', '**/node_modules/**'],
    },
  },
  {
    test: {
      name: 'sources',
      root: './packages/sources',
      environment: 'node',
      include: ['./src/**/*.test.ts'],
      exclude: ['./dist/**', '**/node_modules/**'],
    },
  },
])
