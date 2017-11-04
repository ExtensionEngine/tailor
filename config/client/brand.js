const brandConfig = require('rcfile')('brand-');
const map = require('lodash/map');
const merge = require('lodash/merge');

const IMAGES_PATH = '/assets/img';

const APP_CONFIG = merge({
  title: 'Tailor',
  favicon: 'default-favicon.ico',
  logo: {
    compact: 'default-logo-compact.svg',
    full: 'default-logo-full.svg'
  }
}, brandConfig);

const STYLE_CONFIG = merge({
  brandColor: '#3949AB',
  altBrandColor: '#5C6BC0'
}, brandConfig.style);

module.exports = {
  globals: {
    TITLE: APP_CONFIG.title,
    FAVICON: `${IMAGES_PATH}/${APP_CONFIG.favicon}`,
    LOGO_COMPACT: `${IMAGES_PATH}/${APP_CONFIG.logo.compact}`,
    LOGO_FULL: `${IMAGES_PATH}/${APP_CONFIG.logo.full}`
  },
  style: map(STYLE_CONFIG, (val, key) => `$${key}: ${val};`).join('\n')
};
