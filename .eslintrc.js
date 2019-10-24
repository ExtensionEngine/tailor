'use strict';

module.exports = {
  root: true,
  overrides: [{
    files: ['extensions/**'],
    parserOptions: {
      parser: 'babel-eslint',
      sourceType: 'module'
    }
  }],
  extends: '@extensionengine',
  globals: {
    BRAND_CONFIG: true
  }
};
