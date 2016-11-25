const projectRoot = require('../helpers/projectRoot');
const utils = require('../../client/build/utils');

const ASSETS_PUBLIC_PATH = '/';
const DIST_PATH = projectRoot('dist');
const USE_CSS_SOURCE_MAP = true;

module.exports = {
  entry: {
    app: './client/main.js'
  },
  output: {
    path: DIST_PATH,
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
      components: projectRoot('client', 'components')
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
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  vue: {
    loaders: utils.cssLoaders({ sourceMap: USE_CSS_SOURCE_MAP }),
    postcss: [
      require('autoprefixer')({
        browsers: ['last 2 versions']
      })
    ]
  }
};
