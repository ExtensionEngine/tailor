'use strict';

exports.name = 'copy';

exports.apply = (api, { patterns = [], options = {} } = {}) => {
  api.hook('createWebpackChain', config => {
    config
      .plugin('copy')
      .use(require('copy-webpack-plugin'), [patterns, options]);
  });
};
