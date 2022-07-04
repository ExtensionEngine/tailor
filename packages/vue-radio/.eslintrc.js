'use strict';

module.exports = {
  root: true,
  extends: '@extensionengine/eslint-config/base',
  overrides: [{
    files: ['src/**', 'vite.config.js'],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  }]
};
