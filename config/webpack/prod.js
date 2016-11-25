const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const baseConfig = require('./base');
const loaderGenerators = require('../helpers/loaderGenerators');
const projectRoot = require('../helpers/projectRoot');
const utils = require('../../client/build/utils');

const ASSETS_SUBDIRECTORY = 'static';
const BUILD_INDEX = projectRoot('dist', 'index.html');
const USE_CSS_SOURCE_MAP = true;

const getAssetsPath = _path => path.posix.join(ASSETS_SUBDIRECTORY, _path);

let webpackConfig = merge(baseConfig, {
  devtool: '#source-map',
  output: {
    filename: getAssetsPath('js/[name].[chunkhash].js'),
    chunkFilename: getAssetsPath('js/[id].[chunkhash].js')
  },
  module: {
    loaders: loaderGenerators.styleLoaders({ sourceMap: true, extract: true })
  },
  vue: {
    loaders: utils.cssLoaders({ sourceMap: USE_CSS_SOURCE_MAP, extract: true })
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"production"' }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css')),
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : BUILD_INDEX,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
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
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    })
  ]
});

module.exports = webpackConfig;
