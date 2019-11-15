'use strict';

module.exports = {
  extends: '@extensionengine/stylelint-config',
  rules: {
    'selector-pseudo-element-no-unknown': [true, {
      ignorePseudoElements: ['v-deep']
    }]
  }
};
