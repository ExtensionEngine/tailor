const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const merge = require('lodash/merge');
const path = require('path');

const rootPath = path.resolve(__dirname, '../../');

// TODO: Remove alias to vue+compiler once vue-strap is removed
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

const uglifyJsOptions = {
  compressor: { warnings: false, keep_fnames: true },
  mangle: { keep_fnames: true }
};

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
  webpack(config) {
    config.module.rules.push(...rules);
    return config;
  },
  extendWebpack(config) {
    config.resolve.alias.merge(aliases);
    if (options.mode !== 'production') return;
    config.plugin('minimize').tap(args => [merge(...args, uglifyJsOptions)]);
    if (options.analyze) {
      config.plugin('analyzer')
        .use(BundleAnalyzerPlugin);
    }
  },
  sourceMap: options.mode === 'development',
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
