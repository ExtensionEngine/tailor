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
    'vuetify/no-legacy-grid': 'error',
    'vue/valid-v-slot': ['error', {
      allowModifiers: true
    }]
  },
  overrides: [
    {
      files: ['client/components/content-elements/**/server/**'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  globals: {
    BRAND_CONFIG: true
  }
};
