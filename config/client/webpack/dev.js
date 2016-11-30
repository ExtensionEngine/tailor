const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseConfig = require('./base');
const envSettings = require('../helpers/envSettings');
const loaderGenerators = require('../helpers/loaderGenerators');

let webpackConfig = merge(baseConfig, {
  devtool: '#eval-source-map',
  entry: ['./config/client/helpers/devClient.js', './client/main.js'],
  module: {
    loaders: loaderGenerators.styleLoaders({ sourceMap: envSettings.dev.cssSourceMap })
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': envSettings.dev.env
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
});

module.exports = webpackConfig;
