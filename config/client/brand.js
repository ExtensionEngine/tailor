const brandConfig = require('rcfile')('brand-');
const map = require('lodash/map');
const merge = require('lodash/merge');

const imagesPath = '/assets/img';

const defaultGlobals = {
  title: {
    full: 'Tailor Author',
    short: 'Tailor',
    sub: 'Content Authoring'
  },
  logo: {
    compact: 'default-logo-compact.svg',
    full: 'default-logo-full.svg'
  },
  favicon: 'default-favicon.ico'
};

const defaultStyle = {
  brandColor: '#3949AB',
  altBrandColor: '#5C6BC0'
};

const config = merge(defaultGlobals, brandConfig);

const styleConstants = merge(defaultStyle, brandConfig.style);
const style = map(styleConstants, (val, key) => `$${key}: ${val};`).join('\n');

module.exports = {
  globals: {
    TITLE_FULL: config.title.full,
    TITLE_SHORT: config.title.short,
    TITLE_SUB: config.title.sub,
    LOGO_COMPACT: `${imagesPath}/${config.logo.compact}`,
    LOGO_FULL: `${imagesPath}/${config.logo.full}`,
    FAVICON: `${imagesPath}/${config.favicon}`
  },
  style
};
