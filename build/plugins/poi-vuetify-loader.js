'use strict';

exports.name = 'poi-vuetify-loader';
exports.apply = (api, options = {}) => {
  api.hook('createWebpackChain', config => {
    config
      .plugin('VuetifyLoaderPlugin')
      .use(require.resolve('vuetify-loader/lib/plugin'), [options]);
  });
};
