'use strict';

const JoyCon = require('joycon');
const map = require('lodash/map');
const merge = require('lodash/merge');
const path = require('path');
const stripJsonComments = require('strip-json-comments');

exports.name = 'tailor:brand';

const prefix = `${exports.name}-plugin:`;
const toScssVariable = (value, name) => `$${name}: ${value};`;

const joycon = new JoyCon({
  files: ['brand.config.json', 'brand.config.js'],
  parseJSON: str => JSON.parse(stripJsonComments(str))
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

exports.apply = ({ config, logger }, { imagesPath = '/assets/img/' } = {}) => {
  const { path: configPath, data = {} } = joycon.loadSync();
  if (configPath) {
    logger.debug(prefix, `Using brand config file: ${configPath}`);
  } else {
    logger.debug(prefix, 'Using default brand configration');
  }

  const constants = merge(getAppConfig(), data);
  const style = merge(getStyleConfig(), data.style);

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
    BRAND_CONFIG: {
      TITLE: JSON.stringify(constants.title),
      FAVICON: JSON.stringify(path.join(imagesPath, constants.favicon)),
      LOGO_COMPACT: JSON.stringify(path.join(imagesPath, constants.logo.compact)),
      LOGO_FULL: JSON.stringify(path.join(imagesPath, constants.logo.full))
    }
  });
};
