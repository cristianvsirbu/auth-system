import react from '@vitejs/plugin-react';
import { type UserConfig, defineConfig } from 'vite';
import biomePlugin from 'vite-plugin-biome';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), biomePlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    // setupFiles: './src/tests/setup.ts',
    exclude: ['e2e-tests/**', 'node_modules', 'dist', '.git'],
    coverage: {
      provider: 'v8',
      reporter: ['cobertura', 'text', 'html'],
      reportsDirectory: 'coverage-reports',
      include: ['src/**/*.{js,ts,jsx,tsx}'],
      exclude: [
        'src/**/*.test.{js,ts,jsx,tsx}',
        'src/**/__mocks__/**',
        'src/**/stories/**',
        'src/**/*.d.ts',
      ],
    },
  },
} as UserConfig);
