import { defineConfig } from 'vite';

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  build: {
    lib: {
      entry: './src/index.js',
      name: 'TailorUtils',
      fileName: format => `tailor-utils.${format}.js`,
      formats: ['es', 'cjs']
    }
  }
};

export default () => defineConfig(config);
