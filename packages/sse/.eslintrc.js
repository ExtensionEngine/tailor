'use strict';

module.exports = {
  root: true,
  extends: '@extensionengine/eslint-config',
  overrides: [{
    files: ['src/lib/**'],
    parserOptions: {
      sourceType: 'script'
    }
  }]
};
