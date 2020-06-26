'use strict';

exports.name = 'copy';

/**
 * @param {import('poi')} api
 * @param {Object} options
 */
exports.apply = (api, { patterns = [], options = {} } = {}) => {
  api.hook('createWebpackChain', config => {
    config
      .plugin('copy')
      .use(require('copy-webpack-plugin'), [patterns, options]);
  });
};
