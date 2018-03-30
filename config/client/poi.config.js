const brand = require('./brand');
const Dotenv = require('dotenv-webpack');
const find = require('lodash/find');
const merge = require('lodash/merge');
const path = require('path');
const serverPort = require('../server').port;

const rootPath = path.resolve(__dirname, '../../');
const aliases = {
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
  test: /\.load\.js$/,
  use: 'val-loader'
}];

const uglifyJsOptions = {
  compressor: { warnings: false, keep_fnames: true },
  mangle: { keep_fnames: true }
};

const applyBrandConfig = config => {
  const exposeBrandStyle = options => merge(options, { data: brand.style });
  config.module.rule('scss').use('sass-loader').tap(exposeBrandStyle);
  config.module.rule('vue').use('vue-loader').tap(config => {
    const sassLoader = find(config.loaders.scss, { loader: 'sass-loader' });
    if (sassLoader) exposeBrandStyle(sassLoader.options);
    return config;
  });
};

module.exports = (options, req) => ({
  presets: [
    require('poi-preset-eslint')({ mode: '*' }),
    require('poi-preset-bundle-report')()
  ],
  entry: {
    app: 'client/main.js'
  },
  dist: 'dist',
  html: {
    title: brand.globals.TITLE,
    favicon: `client/${brand.globals.FAVICON}`
  },
  define: { BRAND_CONFIG: brand.globals },
  webpack(config) {
    config.module.rules.push(...rules);
    config.plugins.push(new Dotenv());
    return config;
  },
  extendWebpack(config) {
    configureModuleResolution(config);
    config.resolve.alias.merge(aliases);
    applyBrandConfig(config);
    if (options.mode !== 'production') return;
    config.plugin('minimize').tap(args => [merge(...args, uglifyJsOptions)]);
  },
  copy: { from: 'client/assets/img', to: 'assets/img' },
  sourceMap: options.mode === 'development',
  hotEntry: 'app',
  generateStats: true,
  // Override using: `npm run dev:server -- --port <number>`
  port: 8080,
  devServer: {
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${serverPort}`
      }
    }
  }
});

// NOTE: Remove absolute path to local `node_modules` from configuration
// https://github.com/webpack/webpack/issues/6538#issuecomment-367324775
function configureModuleResolution(config) {
  const localModules = path.join(rootPath, 'node_modules');
  config.resolve.modules.delete(localModules);
  config.resolveLoader.modules.delete(localModules);
}
