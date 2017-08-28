const { ProvidePlugin } = require('webpack');
const autoprefixer = require('autoprefixer');

const { dev, prod } = require('../helpers/envSettings');
const getAssetsPath = require('../helpers/assetsPath');
const loaderGenerators = require('../helpers/loaderGenerators');
const projectRoot = require('../helpers/projectRoot');

const isProduction = process.env.NODE_ENV === 'production';

const publicPath = isProduction ? prod.assetsPublicPath : dev.assetsPublicPath;

const cssSourceMapDev = !isProduction && dev.cssSourceMap;
const cssSourceMapProd = isProduction && prod.cssSourceMap;
const sourceMap = cssSourceMapDev || cssSourceMapProd;

module.exports = {
  entry: {
    app: './client/main.js'
  },
  output: {
    path: prod.assetsRoot,
    publicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: projectRoot('node_modules'),
    alias: {
      vue$: 'vue/dist/vue.common.js',
      client: projectRoot('client'),
      assets: projectRoot('client', 'assets'),
      components: projectRoot('client', 'components'),
      shared: projectRoot('config/shared'),
      utils: projectRoot('client', 'utils'),
      EventBus: projectRoot('client', 'EventBus')
    }
  },
  resolveLoader: {
    fallback: projectRoot('node_modules')
  },
  module: {
    preLoaders: [{
      test: /\.vue$/,
      loader: 'eslint',
      include: projectRoot(),
      exclude: /node_modules/
    }, {
      test: /\.js$/,
      loader: 'eslint',
      include: projectRoot(),
      exclude: /node_modules/
    }],
    loaders: [{
      test: /\.vue$/,
      loader: 'vue'
    }, {
      test: /\.load.js$/,
      loader: 'val'
    }, {
      test: /\.js$/,
      loader: 'babel',
      include: projectRoot(),
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url',
      query: {
        limit: 10000,
        name: getAssetsPath('img/[name].[hash:7].[ext]')
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url',
      query: {
        limit: 10000,
        name: getAssetsPath('fonts/[name].[hash:7].[ext]')
      }
    }]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  vue: {
    loaders: loaderGenerators.cssLoaders({ sourceMap }),
    postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ]
  },
  plugins: [
    new ProvidePlugin({ $: 'jquery', jQuery: 'jquery' })
  ]
};
