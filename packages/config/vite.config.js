import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const _dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  build: {
    lib: {
      entry: path.join(_dirname, './src/index.js'),
      name: 'TailorConfig',
      formats: ['es', 'cjs', 'umd']
    }
  }
};

export default () => defineConfig(config);
