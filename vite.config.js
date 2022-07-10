import { createVuePlugin } from 'vite-plugin-vue2';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'url';
import legacy from '@vitejs/plugin-legacy'
import merge from 'lodash/merge';
import path from 'path';
import viteCompression from 'vite-plugin-compression';
import yn from 'yn';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  base: '',
  root: path.join(_dirname, 'client/'),
  resolve: {
    alias: [{
      find: '~',
      replacement: path.join(_dirname, 'node_modules')
    }, {
      find: '@/',
      replacement: path.join(_dirname, 'client/')
    }, {
      find: 'client/',
      replacement: path.join(_dirname, 'client/')
    }, {
      find: 'components/',
      replacement: path.join(_dirname, 'client/components/')
    }, {
      find: 'utils/',
      replacement: path.join(_dirname, 'client/utils/')
    }, {
      find: 'assets/',
      replacement: path.join(_dirname, 'client/assets/')
    }, {
      find: 'shared/',
      replacement: path.join(_dirname, 'config/shared/')
    }]
  },
  plugins: [
    createVuePlugin(),
    legacy({ targets: ['defaults'] }),
    viteCompression()
  ],
  rollupOptions: {}
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const define = {
    API_PATH: "'/api'",
    ENABLE_DEFAULT_SCHEMA: yn(env.ENABLE_DEFAULT_SCHEMA),
    OIDC_ENABLED: yn(env.OIDC_ENABLED),
    OIDC_LOGOUT_ENABLED: yn(env.OIDC_LOGOUT_ENABLED),
    OIDC_LOGIN_TEXT: `"${env.OIDC_LOGIN_TEXT}"`,
    'process.env': {} // Patch due to being elimated
  }
  const server = {
    host: env.HOSTNAME || '0.0.0.0',
    port: env.REVERSE_PROXY_PORT || 8080
  }
  return merge(config, { server, define })
});
