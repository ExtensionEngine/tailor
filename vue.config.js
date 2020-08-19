'use strict';

const path = require('path');
const serverPort = require('./config/server').port;
const yn = require('yn');

const {
  AUTH_JWT_SCHEME,
  ENABLE_DEFAULT_SCHEMA,
  STORAGE_PATH
} = process.env;
const imagesPath = 'assets/img';
const serverUrl = `http://127.0.0.1:${serverPort}`;

const aliases = {
  '@': path.resolve(__dirname, './client'),
  client: '@',
  assets: '@/assets',
  components: '@/components',
  'tce-core': '@/components/common/tce-core',
  EventBus: '@/EventBus',
  utils: '@/utils',
  shared: path.join(__dirname, 'config/shared'),
  tce: path.join(__dirname, 'content-elements'),
  extensions: path.join(__dirname, 'extensions')
};

const copy = [{ from: 'client/assets/img', to: imagesPath }];

/** @type {import('@vue/cli-service').ProjectOptions} */
module.exports = {
  pages: {
    index: {
      entry: './client/main.js',
      title: 'Tailor',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
      appMountId: 'app'
    }
  },
  runtimeCompiler: true,
  devServer: {
    headers: {
      'X-Powered-By': 'Webpack DevSever'
    },
    proxy: {
      '/api': { target: serverUrl, ws: false },
      ...STORAGE_PATH && { '/repository': { target: serverUrl } }
    },
    port: 8080
  },
  pluginOptions: {
    brand: {
      files: ['.brandrc', '.brandrc.js'],
      imagesPath
    },
    cleanOutDir: {
      cleanOnceBeforeBuildPatterns: ['**/*', '!.gitkeep']
    },
    copy: { patterns: copy },
    envs: {
      APP_TITLE: 'Tailor',
      API_PATH: '/api/v1/',
      AUTH_JWT_SCHEME,
      ENABLE_DEFAULT_SCHEMA: yn(ENABLE_DEFAULT_SCHEMA),
      VUEX_STORAGE_KEY: 'TAILOR_APP_STATE'
    },
    sassResources: {
      resources: './client/assets/stylesheets/common/_variables.scss'
    }
  },
  chainWebpack(config) {
    config.resolve.alias.merge(aliases);

    config.module.rule('bootstrap')
      .test(/bootstrap-sass[/\\]assets[/\\]javascripts[/\\]/)
      .post()
      .use('imports-loader')
      .loader(require.resolve('imports-loader'))
      .options({ jQuery: 'jquery' });

    config.module.rule('val')
      .test(/\.load\.js$/)
      .post()
      .use('val-loader')
      .loader(require.resolve('val-loader'));
  }
};
