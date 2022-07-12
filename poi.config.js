'use strict';

const path = require('path');
const serverPort = require('./config/server').port;
const yn = require('yn');

const {
  ENABLE_DEFAULT_SCHEMA,
  NODE_ENV,
  STORAGE_PATH,
  OIDC_ENABLED,
  OIDC_LOGOUT_ENABLED,
  OIDC_LOGIN_TEXT
} = process.env;
const imagesPath = 'assets/img';
const isProduction = NODE_ENV === 'production';
const serverUrl = `http://127.0.0.1:${serverPort}`;

const aliases = {
  '@': path.resolve(__dirname, './client'),
  client: '@',
  assets: '@/assets',
  components: '@/components',
  'tce-core': '@/components/common/tce-core',
  utils: '@/utils',
  shared: path.join(__dirname, 'config/shared'),
  tce: path.join(__dirname, 'content-elements'),
  extensions: path.join(__dirname, 'extensions')
};

const copy = [{ from: 'client/assets/img', to: imagesPath }];

/** @type {import('poi').Config.DevServer} */
const devServer = {
  headers: {
    'X-Powered-By': 'Webpack DevSever'
  },
  proxy: {
    '/api': { target: serverUrl },
    '/proxy': serverUrl,
    ...(STORAGE_PATH ? { '/repository': serverUrl } : {})
  },
  // Override using: `npm run dev:server -- --port <number>`
  port: 8080,
  hotEntries: ['app']
};

const extensions = ['.vue'];

/** @type {import('poi').Config} */
module.exports = {
  plugins: [
    '@poi/bundle-report',
    require.resolve('./build/plugins/stats'),
    {
      resolve: require.resolve('./build/plugins/output-filenames'),
      options: {
        vendor: {
          font: 'assets/fonts/[name].[ext]',
          image: 'assets/images/[name].[ext]'
        }
      }
    }, {
      resolve: require.resolve('./build/plugins/copy'),
      options: { patterns: copy }
    }, {
      resolve: require.resolve('./build/plugins/clean-out-dir'),
      options: {
        cleanOnceBeforeBuildPatterns: ['**/*', '!.gitkeep']
      }
    },
    require.resolve('./build/plugins/html-version-spec'),
    {
      resolve: require.resolve('./build/plugins/brand'),
      options: {
        files: ['.brandrc', '.brandrc.js'],
        imagesPath
      }
    }, {
      resolve: 'poi-preset-sass-resources',
      options: {
        resources: './client/assets/stylesheets/common/_variables.scss'
      }
    }
  ],
  entry: {
    app: 'client/main.js'
  },
  output: {
    dir: 'dist',
    sourceMap: !isProduction
  },
  envs: {
    API_PATH: '/api',
    ENABLE_DEFAULT_SCHEMA: yn(ENABLE_DEFAULT_SCHEMA),
    OIDC_ENABLED: yn(OIDC_ENABLED),
    OIDC_LOGOUT_ENABLED: yn(OIDC_LOGOUT_ENABLED),
    OIDC_LOGIN_TEXT
  },
  babel: {
    transpileModules: [
      // NOTE: Remove after new version of tce-jodit
      'auto-bind',
      // NOTE: Packages do NOT contain transpiled code.
      'humanize-string', 'decamelize',
      // NOTE: Unclear why is this necessary :/
      'vue-quill-editor'
    ]
  },
  chainWebpack(config, { mode }) {
    config.resolve.alias.merge(aliases);
    config.resolve.extensions.merge(extensions);

    config.module.rule('event-source-polyfill')
      .test(require.resolve('event-source-polyfill'))
      .post()
      .use('exports-loader')
      .loader(require.resolve('exports-loader'))
      .options({ EventSource: 'exports.EventSourcePolyfill || exports.NativeEventSource' });

    config.module.rule('val')
      .test(/\.load\.js$/)
      .post()
      .use('val-loader')
      .loader(require.resolve('val-loader'));
  },
  devServer
};
