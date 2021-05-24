'use strict';

module.exports = {
  root: true,
  extends: '@extensionengine/eslint-config/base',
  overrides: [{
    files: ['src/**'],
    parserOptions: {
      parser: '@babel/eslint-parser',
      sourceType: 'module'
    }
  }]
};
