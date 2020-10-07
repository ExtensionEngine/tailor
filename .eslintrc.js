'use strict';

module.exports = {
  root: true,
  extends: '@extensionengine',
  plugins: [
    'vuetify',
    '@babel'
  ],
  rules: {
    'vuetify/no-deprecated-classes': 'error',
    'vuetify/grid-unknown-attributes': 'error',
    'vuetify/no-legacy-grid': 'error'
  },
  overrides: [{
    files: ['extensions/**'],
    parserOptions: {
      parser: '@babel/eslint-parser',
      sourceType: 'module'
    }
  }],
  globals: {
    BRAND_CONFIG: true
  }
};
