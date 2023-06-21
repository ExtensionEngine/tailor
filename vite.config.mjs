import { brandConfig, brandStyles } from './config/client/brand.loader.js';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';
import htmlReplace from './build/plugins/vite/html-replace.js';
import path from 'node:path';
import { origin as serverUrl } from './config/server/index.js';
import vue from '@vitejs/plugin-vue2';
import yn from 'yn';

const _dirname = fileURLToPath(new URL('.', import.meta.url));

const getDefine = env => ({
  'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
  'process.env.API_PATH': JSON.stringify('/api'),
  'process.env.ENABLE_DEFAULT_SCHEMA': yn(env.ENABLE_DEFAULT_SCHEMA),
  'process.env.OIDC_ENABLED': yn(env.OIDC_ENABLED),
  'process.env.OIDC_LOGOUT_ENABLED': yn(env.OIDC_LOGOUT_ENABLED),
  'process.env.OIDC_LOGIN_TEXT': JSON.stringify(env.OIDC_LOGIN_TEXT),
  'BRAND_CONFIG.TITLE': JSON.stringify(brandConfig.title),
  'BRAND_CONFIG.FAVICON': JSON.stringify(brandConfig.favicon),
  'BRAND_CONFIG.LOGO_COMPACT': JSON.stringify(brandConfig.logo.compact),
  'BRAND_CONFIG.LOGO_FULL': JSON.stringify(brandConfig.logo.full)
});
const getServer = env => ({
  host: env.HOSTNAME || '0.0.0.0',
  port: env.REVERSE_PROXY_PORT || 8080,
  hrm: true,
  proxy: {
    // Needs to exclude files from `cilent/api` folder, as they shouldn't be proxied
    // eslint-disable-next-line no-useless-escape
    '^\/api\/(?![A-Za-z]+\.js)': serverUrl,
    '/proxy': serverUrl,
    ...(env.STORAGE_PATH ? { '/repository': serverUrl } : {})
  }
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
    replacement: path.join(_dirname, 'config/shared/tailor.loader.js')
  },
  {
    find: /^~.+/,
    replacement: val => val.replace(/^~/, '')
  }
];
const plugins = [
  vue(),
  htmlReplace({
    defaults: true,
    replacements: { ...brandConfig }
  })
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  /**
   * @type {import('vite').UserConfig}
   */
  return {
    base: './',
    publicDir: 'assets/img',
    root: path.join(_dirname, 'client'),
    optimizeDeps: {
      include: ['tailor-config'],
    },
    build: {
      outDir: '../dist',
      commonjsOptions: {
        include: [/tailor\.config\.js/, /node_modules/]
      }
    },
    resolve: {
      alias
    },
    define: getDefine(env),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import '@/assets/stylesheets/common/_variables.scss';
            ${brandStyles}
          `
        }
      }
    },
    server: getServer(env),
    plugins
  };
});
