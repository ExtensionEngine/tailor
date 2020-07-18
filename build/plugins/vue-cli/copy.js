'use strict';

const CopyPlugin = require('copy-webpack-plugin');

module.exports = (api, { pluginOptions } = {}) => {
  const { patterns, options } = pluginOptions.copy;
  api.chainWebpack(config =>
    config
      .plugin('copy')
      .use(CopyPlugin, [patterns, options]));
};
