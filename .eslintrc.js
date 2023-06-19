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
      files: [
        'build/plugins/vite/**',
        'client/**',
        'common/**',
        'config/**',
        'server/**',
        'vite.config.js'
      ],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false
      }
    },
    {
      files: [
        'server/shared/database/migrations/**',
        'server/shared/database/seeds/**'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ]
};
