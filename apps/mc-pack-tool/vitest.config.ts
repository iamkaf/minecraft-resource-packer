// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      lines: 90,
      functions: 90,
      branches: 90,
      statements: 90,
      include: [
        'src/main/**/*.ts',
        'src/preload/**/*.ts',
        'src/renderer/**/*.ts',
        'src/renderer/**/*.tsx',
        'src/shared/**/*.ts',
      ],
      exclude: [
        'src/main/index.ts',
        'src/renderer/index.tsx',
        'src/main/assets.ts',
        'src/main/projects.ts',
      ],
      all: true,
    },
  },
});
