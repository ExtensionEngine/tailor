const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const webpack = require('webpack');

const { DefinePlugin, HotModuleReplacementPlugin, NoErrorsPlugin } = webpack;
const { OccurenceOrderPlugin } = webpack.optimize;

const baseConfig = require('./base');
const { cssSourceMap: sourceMap, env } = require('../helpers/envSettings').dev;
const loaderGenerators = require('../helpers/loaderGenerators');

const config = merge(baseConfig, {
  devtool: '#eval-source-map',
  entry: ['./config/client/helpers/devClient.js', './client/main.js'],
  module: {
    loaders: loaderGenerators.styleLoaders({ sourceMap })
  },
  plugins: [
    new DefinePlugin({ 'process.env': env }),
    new OccurenceOrderPlugin(),
    new HotModuleReplacementPlugin(),
    new NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new StyleLintPlugin({ files: ['**/*.vue'] })
  ]
});

module.exports = config;
