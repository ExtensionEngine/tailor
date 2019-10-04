'use strict';

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = (api, { pluginOptions } = {}) => {
  const { build } = api.service.commands;
  const { cleanOutDir } = pluginOptions;
  const buildFn = build.fn;

  build.fn = function (...args) {
    args[0].clean = false;
    api.chainWebpack(config => {
      if (!isProduction || args[0]['no-clean']) return;
      config
        .plugin('clean-out-dir')
        .use(CleanWebpackPlugin, [cleanOutDir]);
    });
    return buildFn.call(this, ...args);
  };
};
