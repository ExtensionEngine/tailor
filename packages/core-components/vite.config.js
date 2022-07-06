import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import path from 'path';
import { fileURLToPath } from 'url';

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
      formats: ['cjs', 'es']
    }
  },
  resolve: {
    alias: [{
      find: '@/',
      replacement: path.join(_dirname, './src/'),
    }]
  },
  plugins: [
    createVuePlugin(),
  ],
  rollupOptions: {
    // Externalize deps that shouldn't be bundled
    external: ['vue', 'vuetify', 'vee-validate'],
    output: {
      // Provide global variables to use in the UMD build
      // for externalized deps
      globals: {
        vue: 'Vue',
        vuetify: 'Vuetify'
      }
    }
  }
}

export default () => defineConfig(config);
