const merge = require('lodash/merge');
const path = require('path');

const rootPath = path.resolve(__dirname, '../../');

const aliases = {
  vue$: 'vue/dist/vue.common.js',
  client: path.join(rootPath, 'client'),
  assets: path.join(rootPath, 'client/assets'),
  components: path.join(rootPath, 'client/components'),
  shared: path.join(rootPath, 'config/shared'),
  utils: path.join(rootPath, 'client/utils'),
  EventBus: path.join(rootPath, 'client/EventBus')
};

const rules = [{
  test: /bootstrap-sass[/\\]assets[/\\]javascripts[/\\]/,
  use: 'imports-loader?jQuery=jquery'
}, {
  test: /\.load.js$/,
  use: 'val-loader'
}];

module.exports = (options, req) => ({
  presets: [
    require('poi-preset-eslint')({ mode: '*' })
  ],
  entry: {
    app: 'client/main.js'
  },
  dist: 'dist',
  autoprefixer: {
    browsers: ['ie >= 10', 'last 4 versions']
  },
  html: {
    template: 'index.html'
  },
  filename: {
    js: '[name].[hash].js',
    css: '[name].[hash].css',
    images: 'assets/images/[name].[ext]',
    fonts: 'assets/fonts/[name].[ext]',
    chunk: '[id].chunk.js'
  },
  webpack(config) {
    config.module.rules.push(...rules);
    return config;
  },
  extendWebpack(config) {
    config.resolve.alias.merge(aliases);
    config.plugin('minimize').tap(args => [merge(...args, {
      compressor: { warnings: false, keep_fnames: true },
      mangle: { keep_fnames: true }
    })]);
  },
  generateStats: true,
  port: 8080,
  devServer: {
    proxy: {
      '/api/v1': {
        target: 'http://127.0.0.1:3000'
      }
    }
  }
});
