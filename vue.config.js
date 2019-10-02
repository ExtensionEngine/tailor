'use strict';

const path = require('path');
const serverPort = require('./config/server').port;

const { STORAGE_PATH } = process.env;
const imagesPath = 'assets/img';
// const isProduction = NOxDE_ENV === 'production';
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

module.exports = {
  pages: {
    index: {
      entry: './client/main.js',
      title: 'Tailor'
    }
  },
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      scss: {
        data: '@import "~@/assets/stylesheets/common/_variables.scss";'
      }
    }
  },
  devServer: {
    proxy: {
      '^/api': { target: serverUrl, ws: false },
      ...STORAGE_PATH && { '^/repository': { target: serverUrl } }
    }
    // Override using: `npm run dev:server -- --port <number>`
  },
  pluginOptions: {
    brand: {
      files: ['.brandrc', '.brandrc.js'],
      imagesPath
    },
    copy: { patterns: copy },
    cleanOutDir: {
      cleanOnceBeforeBuildPatterns: ['**/*', '!.gitkeep']
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

    config
      .plugin('dotenv')
      .use(require.resolve('dotenv-webpack'));

    // if (!isProduction) return;
    // // TODO: convert to Vue Cli
    // config
    //   .plugin('minimize')
    //   .user
    //   .tap(([options]) => {
    //     options.terserOptions.keep_fnames = true;
    //     return [options];
    //   });
  }
};
