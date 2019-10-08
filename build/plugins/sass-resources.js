'use strict';

module.exports = (api, { pluginOptions } = {}) => {
  const { resources } = pluginOptions.sassResources;
  api.chainWebpack(config => {
    const oneOfsMap = config.module.rule('scss').oneOfs.store;
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({ resources })
        .end();
    });
  });
};
