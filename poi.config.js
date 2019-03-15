'use strict';

const path = require('path');
const serverPort = require('./config/server').port;

const { NODE_ENV, STORAGE_PATH } = process.env;
const imagesPath = 'assets/img';
const isProduction = NODE_ENV === 'production';
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
  tce: path.join(__dirname, 'content-elements')
};

const copy = [{ from: 'client/assets/img', to: imagesPath }];

const devServer = {
  headers: {
    'X-Powered-By': 'Webpack DevSever'
  },
  proxy: {
    '/api': { target: serverUrl },
    ...(STORAGE_PATH ? { '/repository': serverUrl } : {})
  },
  // Override using: `npm run dev:server -- --port <number>`
  port: 8080,
  hotEntries: ['app']
};

const extensions = ['.vue'];

module.exports = {
  plugins: [
    '@poi/eslint',
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
      options: { exclude: '.gitkeep' }
    },
    require.resolve('./build/plugins/html-version-spec'),
    {
      resolve: require.resolve('./build/plugins/brand'),
      options: {
        files: ['.brandrc', '.brandrc.js'],
        imagesPath
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
