import { defineConfig, loadEnv } from 'vite';
import Components from 'unplugin-vue-components/vite';
import EnvironmentPlugin from 'vite-plugin-environment';
import { fileURLToPath } from 'url';
import merge from 'lodash/merge';
import path from 'path-browserify';
import viteCompression from 'vite-plugin-compression';
import vue from '@vitejs/plugin-vue2';
import { VuetifyResolver } from 'unplugin-vue-components/resolvers';
// import legacy from '@vitejs/plugin-legacy'

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
    }, {
      find: 'tailor-config',
      replacement: path.join(_dirname, 'config/shared/tailor.loader.mjs')
    }, {
      find: /^~.+/,
      replacement: val => val.replace(/^~/, '')
    }]
  },
  plugins: [
    vue(),
    Components({
      // generate `components.d.ts` global declarations
      // https://github.com/antfu/unplugin-vue-components#typescript
      dts: false,
      // auto import for directives
      directives: false,
      // resolvers for custom components
      resolvers: [
        // Vuetify
        VuetifyResolver(),
      ],
      // https://github.com/antfu/unplugin-vue-components#types-for-global-registered-components
      types: [{
        from: 'vue-router',
        names: ['RouterLink', 'RouterView'],
      }],
    }),
    EnvironmentPlugin({
      API_PATH: '/api',
      ENABLE_DEFAULT_SCHEMA: false,
      OIDC_ENABLED: false,
      OIDC_LOGOUT_ENABLED: false,
      OIDC_LOGIN_TEXT: 'Login with OIDC'
    }),
    // legacy({ targets: ['defaults'] }),
    viteCompression()
  ],
  rollupOptions: {}
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const define = {
    'process.env': {} // Patch due to being eliminated
  }
  const server = {
    host: env.HOSTNAME || '0.0.0.0',
    port: env.REVERSE_PROXY_PORT || 8080
  }
  return merge(config, { server, define })
});
