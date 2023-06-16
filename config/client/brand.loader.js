import config from '../../.brandrc.mjs';
import map from 'lodash/map.js';

const toScssVariable = (value, name) => `$${name}: ${value};`;

export const brandConfig = {
  title: config.title,
  favicon: `/${config.favicon}`,
  logo: {
    compact: `/${config.logo.compact}`,
    full: `/${config.logo.full}`
  }
};

export const brandStyles = map({ ...config.styles }, toScssVariable).join('\n');
