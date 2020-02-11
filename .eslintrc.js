'use strict';

module.exports = {
  root: true,
  extends: '@extensionengine',
  plugins: [
    'vuetify',
    'jest'
  ],
  rules: {
    'vuetify/no-deprecated-classes': 'error',
    'vuetify/grid-unknown-attributes': 'error',
    'vuetify/no-legacy-grid': 'error'
  },
  overrides: [{
    files: ['extensions/**'],
    parserOptions: {
      parser: 'babel-eslint',
      sourceType: 'module'
    }
  },
  {
    files: ['tests/**'],
    parserOptions: {
      parser: 'babel-eslint',
      sourceType: 'module'
    },
    env: {
      jest: true
    }
  }
],

  globals: {
    BRAND_CONFIG: true
  }
};
