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
  overrides: [
    {
      files: ['client/components/content-elements/**/server/**'],
      parserOptions: {
        sourceType: 'script'
      }
    },
    {
      files: ['extensions/**'],
      excludedFiles: ['extensions/content-elements/**/server/**'],
      parserOptions: {
        parser: '@babel/eslint-parser',
        sourceType: 'module'
      }
    }
  ],
  globals: {
    BRAND_CONFIG: true
  }
};
