'use strict';

module.exports = {
  root: true,
  extends: '@extensionengine/eslint-config',
  overrides: [{
    files: ['src/**', 'vite.config.js'],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  }]
};
