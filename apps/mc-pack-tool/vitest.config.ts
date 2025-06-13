// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'src/preload.ts',
        'forge.config.ts',
        'webpack.*',
        'tailwind.config.ts',
        'src/renderer/index.tsx',
        'src/renderer/utils/*',
      ],
      include: ['src/renderer/components/**/*.{ts,tsx}'],
    },
  },
});
