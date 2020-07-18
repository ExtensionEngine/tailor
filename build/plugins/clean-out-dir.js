'use strict';

exports.name = 'clean-out-dir';

/**
 * @param {import('poi')} api
 * @param {import('clean-webpack-plugin').Options} options
 */
exports.apply = (api, options = {}) => {
  api.hook('createWebpackChain', config => {
    if (!api.isProd || !api.config.output.clean) return;
    const { CleanWebpackPlugin } = require('clean-webpack-plugin');
    options.verbose = Boolean(api.args.options.debug);
    config
      .plugin('clean-out-dir')
      .use(CleanWebpackPlugin, [options]);
  });
};
