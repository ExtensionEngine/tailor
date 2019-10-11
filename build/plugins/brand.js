'use strict';

const { readFileSync } = require('fs');
const isObject = require('lodash/isObject');
const JoyCon = require('joycon');
const map = require('lodash/map');
const merge = require('lodash/merge');
const path = require('path');
const stripJsonComments = require('strip-json-comments');

exports.name = 'tailor:brand';

exports.cli = api => {
  api.command.option('--brand-config <path>', 'Set path to brand config file');
};

const prefix = `${exports.name}-plugin:`;

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

exports.apply = (api, { files, imagesPath } = {}) => {
  const brandConfig = loadConfig(api, files) || {};
  const constants = merge(getAppConfig(), brandConfig);
  const style = merge(getStyleConfig(), brandConfig.style);

  const { config } = api;
  config.output.html = Object.assign({}, config.output.html, {
    title: constants.title,
    favicon: path.join('client/', imagesPath, constants.favicon)
  });
  config.css = Object.assign({}, config.css, {
    loaderOptions: {
      sass: { data: map(style, toScssVariable).join('\n') }
    }
  });
  config.constants = Object.assign({}, config.constants, {
    BRAND_CONFIG: JSON.stringify({
      TITLE: constants.title,
      FAVICON: path.join(imagesPath, constants.favicon),
      LOGO_COMPACT: path.join(imagesPath, constants.logo.compact),
      LOGO_FULL: path.join(imagesPath, constants.logo.full)
    })
  });
};

function loadConfig({ cli, logger }, files) {
  const options = { files };
  if (cli.options.brandConfig) {
    const filepath = path.resolve(cli.options.brandConfig);
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
