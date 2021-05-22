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
    },
    {
      files: ['cypress/**'],
      extends: [
        'plugin:cypress/recommended'
      ],
      plugins: [
        'cypress'
      ],
      rules: {
        'func-names': 'off',
        'cypress/no-assigning-return-values': 'error',
        'cypress/no-unnecessary-waiting': 'error',
        'cypress/assertion-before-screenshot': 'warn',
        'cypress/no-force': 'warn',
        'cypress/no-async-tests': 'error'
      }
    }
  ],
  globals: {
    BRAND_CONFIG: true
  }
};
