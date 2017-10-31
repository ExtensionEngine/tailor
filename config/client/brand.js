const brandConfig = require('rcfile')('brand-');
const map = require('lodash/map');
const merge = require('lodash/merge');

const defaultGlobals = {
  title: {
    full: 'Tailor Content Authoring',
    short: 'Tailor',
    sub: 'Content Authoring'
  },
  logo: {
    compact: '/assets/img/tailor-logo-compact.svg',
    full: '/assets/img/tailor.svg'
  },
  favicon: '/assets/favicon.ico'
};

const defaultStyle = {
  brandColor: 'blue',
  altBrandColor: 'grey'
};

const config = merge(brandConfig, defaultGlobals);
const styleConstants = merge(brandConfig.style, defaultStyle);

const style = map(styleConstants, (val, key) => `$${key}: ${val};`).join('\n');

module.exports = {
  globals: {
    TITLE_FULL: config.title.full,
    TITLE_SHORT: config.title.short,
    TITLE_SUB: config.title.sub,
    LOGO_COMPACT: config.logo.compact,
    LOGO_FULL: config.logo.compact,
    FAVICON: config.favicon
  },
  style
};
