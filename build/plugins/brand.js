'use strict';

const { readFileSync } = require('fs');
const isObject = require('lodash/isObject');
const JoyCon = require('joycon');
const map = require('lodash/map');
const merge = require('lodash/merge');
const path = require('path');
const stripJsonComments = require('strip-json-comments');
const logger = require('../../server/shared/logger');

const prefix = 'tailor:brand-plugin:';

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

module.exports = (api, { pluginOptions } = {}) => {
  const { files, imagesPath } = pluginOptions.brand;
  const brandConfig = loadConfig(api, files) || {};
  const constants = merge(getAppConfig(), brandConfig);
  const style = merge(getStyleConfig(), brandConfig.style);

  const { projectOptions } = api.service;

  projectOptions.pages.index = Object.assign({}, projectOptions.pages.index, {
    title: constants.title,
    favicon: path.join('client/', imagesPath, constants.favicon)
  });

  projectOptions.css.loaderOptions = Object.assign({}, projectOptions.css.loaderOptions, {
    sass: { data: map(style, toScssVariable).join('\n') }
  });

  api.service.projectOptions = projectOptions;

  api.chainWebpack(webpackConfig => {
    webpackConfig.plugin('DefinePlugin')
        .use(require('webpack').DefinePlugin, [{
          BRAND_CONFIG: JSON.stringify({
            TITLE: constants.title,
            FAVICON: path.join(imagesPath, constants.favicon),
            LOGO_COMPACT: path.join(imagesPath, constants.logo.compact),
            LOGO_FULL: path.join(imagesPath, constants.logo.full)
          })
        }]);
  });
};

function loadConfig({ inlineOptions }, files) {
  const options = { files };
  if (inlineOptions && inlineOptions.brandConfig) {
    const filepath = path.resolve(inlineOptions.brandConfig);
    const filename = path.basename(filepath);
    const parentDir = path.dirname(filepath);
    Object.assign(options, {
      files: [filename],
      cwd: parentDir,
      stopDir: path.dirname(parentDir)
    });
  }
  const { path: configPath, data: config } = joycon.loadSync(options);
  if (!configPath) {
    return logger.debug(prefix, 'Using default brand configration');
  }
  if (!isObject(config)) {
    return logger.error(prefix, `Invalid config provided: ${configPath}`);
  }
  logger.debug(prefix, `Using brand config file: ${configPath}`);
  return config;
}
