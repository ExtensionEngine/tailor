import camelCase from 'lodash/camelCase.js';

const tceConfig = Object.keys(process.env)
  .map(it => it.match(/^TCE_(.*)/))
  .filter(Boolean)
  .reduce((config, [prefixedKey, key]) => ({
    ...config,
    [camelCase(key)]: process.env[prefixedKey]
  }), {});

export default tceConfig;
