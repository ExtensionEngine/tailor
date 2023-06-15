import map from 'lodash/map.js';
import config from '../../.brandrc.mjs';

const IMAGES_PATH = 'assets/img';
const toScssVariable = (value, name) => `$${name}: ${value};`

export const brandConfig = {
  title: config.title,
  favicon: `${IMAGES_PATH}/${config.favicon}`,
  logo: {
    compact: `${IMAGES_PATH}/${config.logo.compact}`,
    full: `${IMAGES_PATH}/${config.logo.full}`
  }
};

export const brandStyles = map({ ...config.styles }, toScssVariable).join('\n');


