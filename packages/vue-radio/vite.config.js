import { defineConfig } from 'vite';

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  build: {
    lib: {
      entry: './src/index.js',
      name: 'VueRadio',
      formats: ['es', 'cjs']
    }
  }
};

export default () => defineConfig(config);
