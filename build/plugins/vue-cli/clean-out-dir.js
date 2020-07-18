'use strict';

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (api, { pluginOptions } = {}) => {
  const { build } = api.service.commands;
  const { cleanOutDir } = pluginOptions;
  const buildFn = build.fn;

  build.fn = function (args, _api, _options) {
    const clean = args.clean !== false;
    api.chainWebpack(config => {
      if (!clean) return;
      config
        .plugin('clean-out-dir')
        .use(CleanWebpackPlugin, [cleanOutDir]);
    });
    args.clean = false;
    return buildFn.apply(this, arguments);
  };
};
