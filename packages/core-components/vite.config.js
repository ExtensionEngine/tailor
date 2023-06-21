import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vue from '@vitejs/plugin-vue2';

const _dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * @type {import('vite').UserConfig}
 */
export default {
  build: {
    lib: {
      entry: './src/index.js',
      name: 'TailorCoreComponents',
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled
      external: ['vue', 'vuetify', 'vee-validate']
    }
  },
  resolve: {
    alias: [{
      find: '@/',
      replacement: path.join(_dirname, './src/')
    }]
  },
  plugins: [vue()]
};
