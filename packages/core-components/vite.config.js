import { createVuePlugin } from 'vite-plugin-vue2';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  build: {
    lib: {
      entry: './src/index.js',
      name: 'TailorCoreComponents',
      formats: ['es', 'cjs', 'umd']
    }
  },
  resolve: {
    alias: [{
      find: '@/',
      replacement: path.join(_dirname, './src/')
    }]
  },
  plugins: [createVuePlugin()],
  rollupOptions: {
    // Externalize deps that shouldn't be bundled
    external: ['vue', 'vuetify', 'vee-validate']
  }
};

export default () => defineConfig(config);
