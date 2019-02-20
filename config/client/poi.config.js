'use strict';

const brand = require('./brand');
const mapValues = require('lodash/mapValues');
const path = require('path');
const serverPort = require('../server').port;

const isProduction = process.env.NODE_ENV === 'production';
const extensions = ['.vue'];

const rootPath = path.resolve(__dirname, '../../');
const aliases = {
  '@': path.resolve(rootPath, './client'),
  client: '@',
  assets: '@/assets',
  components: '@/components',
  shared: path.join(rootPath, 'config/shared'),
  utils: '@/utils',
  tce: path.join(rootPath, 'content-elements'),
  'tce-core': '@/components/common/tce-core',
  EventBus: '@/EventBus'
};

const devServer = {
  headers: {
    'X-Powered-By': 'Webpack DevSever'
  },
  proxy: {
    '/api': {
      target: `http://127.0.0.1:${serverPort}`
    }
  },
  // Override using: `npm run dev:server -- --port <number>`
  port: 8080,
  hotEntries: ['app']
};

module.exports = {
  plugins: [
    '@poi/eslint',
    '@poi/bundle-report'
  ],
  entry: {
    app: 'client/main.js'
  },
  output: {
    dir: 'dist',
    sourceMap: !isProduction,
    html: {
      title: brand.globals.TITLE,
      favicon: path.join('client/', brand.globals.FAVICON)
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: brand.style
      }
    }
  },
  constants: {
    BRAND_CONFIG: mapValues(brand.globals, JSON.stringify)
  },
  chainWebpack(config, { mode }) {
    config.resolve.alias.merge(aliases);
    config.resolve.extensions.merge(extensions);

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

    config
      .plugin('dotenv')
        .use(require('dotenv-webpack'))
        .end()
      .plugin('copy')
        .use(require('copy-webpack-plugin'), [[
          { from: 'client/assets/img', to: 'assets/img' }
        ]]);

    if (mode !== 'production') return;
    config
      .plugin('minimize')
      .tap(([options]) => {
        options.terserOptions.keep_fnames = true;
        return [options];
      });
  },
  devServer
};
