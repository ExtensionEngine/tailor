'use strict';

module.exports = (api, { pluginOptions } = {}) => {
  const { build } = api.service.commands;
  const { cleanOutDir } = pluginOptions;
  const buildFn = build.fn;

  build.fn = (...args) => {
    args[0].clean = false;
    api.chainWebpack(webpackConfig => {
      if (process.env.NODE_ENV !== 'production' || args[0]['no-clean']) return;
      const { CleanWebpackPlugin } = require('clean-webpack-plugin');
      webpackConfig
        .plugin('clean-out-dir')
        .use(CleanWebpackPlugin, [cleanOutDir]);
    });
    return buildFn(...args);
  };
};
