'use strict';

const path = require('path');
const serverPort = require('./config/server').port;

const isProduction = process.env.NODE_ENV === 'production';
const extensions = ['.vue'];

const aliases = {
  '@': path.resolve(__dirname, './client'),
  client: '@',
  assets: '@/assets',
  components: '@/components',
  'tce-core': '@/components/common/tce-core',
  EventBus: '@/EventBus',
  utils: '@/utils',
  shared: path.join(__dirname, 'config/shared'),
  tce: path.join(__dirname, 'content-elements')
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
    '@poi/bundle-report',
    {
      resolve: require.resolve('./build/plugins/copy'),
      options: {
        patterns: [{ from: 'client/assets/img', to: 'assets/img' }]
      }
    }, {
      resolve: require.resolve('./build/plugins/brand')
    }
  ],
  entry: {
    app: 'client/main.js'
  },
  output: {
    dir: 'dist',
    sourceMap: !isProduction
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
      .use(require.resolve('dotenv-webpack'));

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
