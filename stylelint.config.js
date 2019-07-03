/** @type {import('stylelint').Configuration} */
module.exports = {
  extends: 'stylelint-config-standard',
  plugins: ['stylelint-scss', 'stylelint-order'],
  rules: {
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    'at-rule-empty-line-before': ['always', {
      except: ['blockless-after-blockless'],
      ignore: ['after-comment', 'inside-block']
    }],
    'function-name-case': 'lower',
    'selector-list-comma-newline-after': 'never-multi-line',
    'function-comma-space-after': null,
    'order/properties-order': [
      'content',
      'display',
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'transform',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'color',
      'font-size',
      'font-weight',
      'line-height',
      'text-transform',
      'background',
      'background-color',
      'border',
      'cursor'
    ]
  }
};
