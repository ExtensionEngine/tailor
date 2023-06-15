import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import { fileURLToPath } from 'url';
import path from 'path';

const _dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  build: {
    lib: {
      entry: './src/index.js',
      name: 'TailorCoreComponents',
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled
      external: ['vue', 'vuetify', 'vee-validate'],
    },
  },
  resolve: {
    alias: [{
      find: '@/',
      replacement: path.join(_dirname, './src/')
    }]
  },
  plugins: [vue()],
};

export default () => defineConfig(config);
