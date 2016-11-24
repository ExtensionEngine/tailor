const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = require('../../client/config');
const prodLoaderGenerators = require('../helpers/prodLoaderGenerators');
const projectRoot = require('../helpers/projectRoot');
const utils = require('../../client/build/utils');

const distPath = projectRoot('dist');
const assetsPublicPath = '/';
const assetsSubDirectory = 'static';
const useCssSourceMap = true;

const getAssetsPath = _path => path.posix.join(assetsSubDirectory, _path);

module.exports = {
  devtool: '#source-map',
  entry: {
    app: './client/main.js',
  },
  output: {
    path: distPath,
    publicPath: assetsPublicPath,
    filename: getAssetsPath('js/[name].[chunkhash].js'),
    chunkFilename: getAssetsPath('js/[id].[chunkhash].js'),
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: projectRoot('node_modules'),
    alias: {
      vue$: 'vue/dist/vue.common.js',
      src: projectRoot('client', 'src'),
      assets: projectRoot('client', 'src', 'assets'),
      components: projectRoot('client', 'src', 'components'),
    },
  },
  resolveLoader: {
    fallback: projectRoot('node_modules'),
  },
  module: {
    preLoaders: [
      {
        test: /\.vue$/,
        loader: 'eslint',
        include: projectRoot(),
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        include: projectRoot(),
        exclude: /node_modules/,
      },
    ],
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue',
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot(),
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      },
      ...prodLoaderGenerators.styleLoaders({ sourceMap: true, extract: true }),
    ],
  },
  eslint: {
    formatter: require('eslint-friendly-formatter'),
  },
  vue: {
    loaders: utils.cssLoaders({ sourceMap: useCssSourceMap, extract: true }),
    postcss: [
      require('autoprefixer')({
        browsers: ['last 2 versions'],
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.build.env,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css')),
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      chunksSortMode: 'dependency',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module, count) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        );
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor'],
    }),
  ],
};
