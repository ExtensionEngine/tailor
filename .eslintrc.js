'use strict';

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: '@extensionengine',
  plugins: [
    'vuetify'
  ],
  rules: {
    'vuetify/no-deprecated-classes': 'error',
    'vuetify/grid-unknown-attributes': 'error',
    'vuetify/no-legacy-grid': 'error'
  },
  overrides: [{
    files: ['extensions/**'],
    excludedFiles: ['extensions/**/hooks/**/*'],
    parserOptions: {
      parser: '@babel/eslint-parser',
      sourceType: 'module'
    }
  }],
  globals: {
    BRAND_CONFIG: true
  }
};
