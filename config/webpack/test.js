const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const baseConfig = require('./base');
const loaderGenerators = require('../helpers/loaderGenerators');
const projectRoot = require('../helpers/projectRoot');
const testEnv = require('../../client/config/test.env');
const utils = require('../../client/build/utils');

let webpackConfig = merge(baseConfig, {
  module: {
    loaders: loaderGenerators.styleLoaders(),
  },
  devtool: '#inline-source-map',
  vue: {
    loaders: {
      js: 'isparta',
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': testEnv,
    }),
  ],
});

// no need for app entry during tests
delete webpackConfig.entry;

// make sure isparta loader is applied before eslint
webpackConfig.module.preLoaders = webpackConfig.module.preLoaders || [];
webpackConfig.module.preLoaders.unshift({
  test: /\.js$/,
  loader: 'isparta',
  include: projectRoot('client'),
});

// only apply babel for test files when using isparta
webpackConfig.module.loaders.some(function (loader, i) {
  if (loader.loader === 'babel') {
    loader.include = projectRoot('client');
    return true;
  }
});

module.exports = webpackConfig;
