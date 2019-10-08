'use strict';

const { error, info } = require('@vue/cli-shared-utils');
const { DefinePlugin } = require('webpack');
const isObject = require('lodash/isObject');
const JoyCon = require('joycon');
const map = require('lodash/map');
const merge = require('lodash/merge');
const path = require('path');
const { readFileSync } = require('fs');
const stripJsonComments = require('strip-json-comments');

const prefix = 'tailor:brand-plugin';

const parseJSON = str => JSON.parse(stripJsonComments(str));
const toScssVariable = (value, name) => `$${name}: ${value};`;

const joycon = new JoyCon({ parseJSON });
joycon.addLoader({
  test: /\.[^.]*rc$/,
  loadSync: path => parseJSON(readFileSync(path, 'utf-8'))
});

const getAppConfig = () => ({
  title: 'Tailor',
  favicon: 'default-favicon.ico',
  logo: {
    compact: 'default-logo-compact.svg',
    full: 'default-logo-full.svg'
  }
});

const getStyleConfig = () => ({
  brandColor: '#0D47A0',
  altBrandColor: '#5C6BC0'
});

module.exports = (api, { pluginOptions }) => {
  const { serve, build } = api.service.commands;

  const serveFn = serve.fn;
  const buildFn = build.fn;

  serve.fn = function (args, _api, _options) {
    addBranding(api, pluginOptions, args);
    return serveFn.apply(this, arguments);
  };

  build.fn = function (args, _api, _options) {
    addBranding(api, pluginOptions, args);
    return buildFn.apply(this, arguments);
  };
};

function addBranding(api, { brand }, { brandConfig }) {
  const { files, imagesPath } = brand;
  const config = loadConfig(brandConfig, files) || {};
  const constants = merge(getAppConfig(), config);
  const style = merge(getStyleConfig(), config.style);

  const { projectOptions } = api.service;

  projectOptions.pages.index = {
    ...projectOptions.pages.index,
    title: constants.title,
    favicon: path.join('client/', imagesPath, constants.favicon)
  };

  projectOptions.css.loaderOptions = {
    ...projectOptions.css.loaderOptions,
    sass: { data: map(style, toScssVariable).join('\n') }
  };

  api.service.projectOptions = projectOptions;
  api.chainWebpack(config => {
    config
      .plugin('DefinePlugin')
      .use(DefinePlugin, [{
        BRAND_CONFIG: JSON.stringify({
          TITLE: constants.title,
          FAVICON: path.join(imagesPath, constants.favicon),
          LOGO_COMPACT: path.join(imagesPath, constants.logo.compact),
          LOGO_FULL: path.join(imagesPath, constants.logo.full)
        })
      }]);
  });
}

function loadConfig(brandConfig, files) {
  const options = { files };
  if (brandConfig) {
    const filepath = path.resolve(brandConfig);
    const filename = path.basename(filepath);
    const parentDir = path.dirname(filepath);
    Object.assign(options, {
      files: [filename],
      cwd: parentDir,
      stopDir: path.dirname(parentDir)
    });
  }
  const { path: configPath, data: config } = joycon.loadSync(options);
  if (!configPath) return info('Using default brand configuration', prefix);
  if (!isObject(config)) return error(`Invalid config provided: ${configPath}`, prefix);
  info(`Using brand config file: ${configPath}`, prefix);
  return config;
}
