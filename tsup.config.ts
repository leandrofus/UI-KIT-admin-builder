import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'components/index': 'src/components/index.ts',
    'hooks/index': 'src/hooks/index.ts',
    'adapters/index': 'src/adapters/index.ts',
    'field-system/index': 'src/field-system/index.ts',
    'config-system/index': 'src/config-system/index.ts',
    'core/index': 'src/core/index.ts',
    'i18n/index': 'src/i18n/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
  minify: false, // Keep readable for debugging
});
