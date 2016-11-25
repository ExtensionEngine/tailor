const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseConfig = require('./base');

let webpackConfig = merge(baseConfig, {
  devtool: '#eval-source-map',
  entry: ['./client/build/dev-client', './client/main.js'],
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"development"' }
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
