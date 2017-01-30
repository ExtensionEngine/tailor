const webpack = require('webpack');

const envSettings = require('../helpers/envSettings');
const getAssetsPath = require('../helpers/assetsPath');
const loaderGenerators = require('../helpers/loaderGenerators');
const projectRoot = require('../helpers/projectRoot');

const ASSETS_PUBLIC_PATH = process.env.NODE_ENV === 'production'
  ? envSettings.prod.assetsPublicPath
  : envSettings.dev.assetsPublicPath;

const env = process.env.NODE_ENV;
const cssSourceMapDev = (env === 'development' && envSettings.dev.cssSourceMap);
const cssSourceMapProd = (env === 'development' && envSettings.prod.cssSourceMap);
const USE_CSS_SOURCE_MAP = cssSourceMapDev || cssSourceMapProd;

module.exports = {
  entry: {
    app: './client/main.js'
  },
  output: {
    path: envSettings.prod.assetsRoot,
    publicPath: ASSETS_PUBLIC_PATH,
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
      shared: projectRoot('config/shared')
    }
  },
  resolveLoader: {
    fallback: projectRoot('node_modules')
  },
  module: {
    preLoaders: [
      {
        test: /\.vue$/,
        loader: 'eslint',
        include: projectRoot(),
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        include: projectRoot(),
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot(),
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: getAssetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: getAssetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  vue: {
    loaders: loaderGenerators.cssLoaders({ sourceMap: USE_CSS_SOURCE_MAP }),
    postcss: [
      require('autoprefixer')({
        browsers: ['last 2 versions']
      })
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};
