'use strict';

exports.name = 'clean-out-dir';

/**
 * @param {import('poi')} api
 * @returns {Boolean}
 */
exports.when = api => {
  const { isProd, config } = api;
  return isProd && config.output && config.output.clean;
};

/**
 * @param {import('poi')} api
 * @param {import('clean-webpack-plugin').Options} options
 */
exports.apply = (api, options = {}) => {
  api.hook('createWebpackChain', config => {
    options.verbose = Boolean(api.args.options.debug);
    config
      .plugin('clean-out-dir')
      .use(require('clean-webpack-plugin').CleanWebpackPlugin, [options]);
  });
};
