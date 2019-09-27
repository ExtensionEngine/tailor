'use strict';

module.exports = (api, { pluginOptions } = {}) => {
  const { patterns, options } = pluginOptions.copy;
  api.chainWebpack(webpackConfig => {
    webpackConfig
      .plugin('copy')
      .use(require('copy-webpack-plugin'), [patterns, options]);
  });
};
