import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const _dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  build: {
    lib: {
      entry: path.join(_dirname, './src/index.js'),
      name: 'TailorUtils',
      formats: ['es', 'cjs', 'umd']
    }
  }
};

export default () => defineConfig(config);
