'use strict';

const { DefinePlugin } = require('webpack');

const getEnvs = envs => Object.keys(envs)
  .reduce((acc, key) => ({ ...acc, [key]: JSON.stringify(envs[key]) }), {});

module.exports = (api, { pluginOptions } = {}) => {
  api.chainWebpack(config =>
    config
      .plugin('define-env')
      .use(DefinePlugin, [{ 'process.env': getEnvs(pluginOptions.envs) }]));
};
