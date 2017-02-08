const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const baseConfig = require('./base');
const envSettings = require('../helpers/envSettings');
const getAssetsPath = require('../helpers/assetsPath');
const loaderGenerators = require('../helpers/loaderGenerators');
const projectRoot = require('../helpers/projectRoot');

let webpackConfig = merge(baseConfig, {
  devtool: envSettings.prod.cssSourceMap ? '#source-map' : false,
  output: {
    filename: getAssetsPath('js/[name].[chunkhash].js'),
    chunkFilename: getAssetsPath('js/[id].[chunkhash].js')
  },
  module: {
    loaders: loaderGenerators.styleLoaders({
      sourceMap: envSettings.prod.cssSourceMap,
      extract: true
    })
  },
  vue: {
    loaders: loaderGenerators.cssLoaders({
      sourceMap: envSettings.prod.cssSourceMap,
      extract: true
    })
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"production"' }
    }),
    /* new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }), */
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin(getAssetsPath('css/[name].[contenthash].css')),
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : envSettings.prod.index,
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
            projectRoot('node_modules')
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
