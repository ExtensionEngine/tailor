'use strict';

module.exports = {
  root: true,
  extends: '@extensionengine/base',
  overrides: [{
    files: ['src/**'],
    parserOptions: {
      parser: 'babel-eslint',
      sourceType: 'module'
    }
  }]
};
