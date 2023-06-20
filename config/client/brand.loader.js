import map from 'lodash/map.js';
import merge from 'lodash/merge.js';

const toScssVariable = (value, name) => `$${name}: ${value};`;
const defaultConfig = {
  title: 'Tailor',
  logo: {
    compact: 'default-logo-compact.svg',
    full: 'default-logo-full.svg'
  },
  favicon: 'default-favicon.ico',
  style: {
    brandColor: '#0D47A0',
    altBrandColor: '#5C6BC0'
  }
};

async function loadConfig() {
  let userConfig;

  try {
    ({ default: userConfig } = await import('../../.brandrc.js'));
  } catch (err) {
    // Nothing to do, user config is not defined, so using default.
  }

  return merge({}, defaultConfig, userConfig);
}

const config = await loadConfig();

export const brandConfig = {
  title: config.title,
  favicon: `/${config.favicon}`,
  logo: {
    compact: `/${config.logo.compact}`,
    full: `/${config.logo.full}`
  }
};

export const brandStyles = map({ ...config.style }, toScssVariable).join('\n');
