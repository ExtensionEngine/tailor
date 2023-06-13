import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue2';
// import legacy from '@vitejs/plugin-legacy';
import Components from 'unplugin-vue-components/vite';
import { VuetifyResolver } from 'unplugin-vue-components/resolvers';
// import { nodePolyfills } from 'vite-plugin-node-polyfills';
import yn  from 'yn';
// import pathBrowserify from 'path-browserify';

const _dirname = fileURLToPath(new URL('.', import.meta.url));
const getDefine = env => ({
  'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
  'process.env.API_PATH': JSON.stringify('/api'),
  'process.env.ENABLE_DEFAULT_SCHEMA': yn(env.ENABLE_DEFAULT_SCHEMA),
  'process.env.OIDC_ENABLED': yn(env.OIDC_ENABLED),
  'process.env.OIDC_LOGOUT_ENABLED': yn(env.OIDC_LOGOUT_ENABLED),
  'process.env.OIDC_LOGIN_TEXT': JSON.stringify(env.OIDC_LOGIN_TEXT),
});
const getServer = env => ({
  host: env.HOSTNAME || '0.0.0.0',
  port: env.REVERSE_PROXY_PORT || 8080
});
const alias = [
  {
    find: '~',
    replacement: path.join(_dirname, 'node_modules')
  },
  {
    find: '@/',
    replacement: path.join(_dirname, 'client/')
  },
  {
    find: 'client/',
    replacement: path.join(_dirname, 'client/')
  },
  {
    find: 'components/',
    replacement: path.join(_dirname, 'client/components/')
  },
  {
   find: 'utils/',
    replacement: path.join(_dirname, 'client/utils/')
  },
  {
    find: 'assets/',
    replacement: path.join(_dirname, 'client/assets/')
  },
  {
    find: 'shared/',
    replacement: path.join(_dirname, 'config/shared/')
  },
  {
    find: 'tailor-config',
    replacement: path.join(_dirname, 'config/shared/tailor.loader.mjs')
  },
  {
    find: /^~.+/,
    replacement: val => val.replace(/^~/, '')
  }
];
const plugins = [
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
    types: [
      {
        from: 'vue-router',
        names: ['RouterLink', 'RouterView'],
      }
    ],
  })//,
  // legacy({
  //   targets: ['last 2 versions', 'ie 11'],
  // })
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  /**
   * @type {import('vite').UserConfig}
   */
  return {
    base: '',
    root: path.join(_dirname, 'client/'),
    build: {
      outDir: "../dist-new"
    },
    resolve: {
      alias
    },
    define: getDefine(env),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import '@/assets/stylesheets/common/_variables.scss';`,
        }
      }
    },
    server: getServer(env),
    plugins
  };
});
