'use strict';

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  // https://github.com/Flet/eslint-config-semistandard
  extends: [
    'semistandard',
    'plugin:vue/recommended'
  ],
  // required to lint *.vue files
  plugins: ['vue'],
  rules: {
    indent: ['error', 2, {
      SwitchCase: 1,
      // NOTE: Consistent indentation IS enforced;
      //       ESLint calculated indentation start IS NOT!
      // https://eslint.org/docs/rules/indent#memberexpression
      MemberExpression: 'off'
    }],
    'arrow-parens': ['error', 'as-needed'],
    // TODO: Remove this after all error reports get resolved!
    'prefer-const': 'off',
    'comma-dangle': ['warn', 'never'],
    'no-debugger': isDev ? 'warn' : 'error',
    'no-unreachable': isDev ? 'warn' : 'error',
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never'
    }],
    'sort-imports': ['error', {
      'ignoreCase': true
    }],
    // Vue rules
    'vue/html-self-closing': ['error', {
      html: {
        void: 'never',
        normal: 'never',
        component: 'always'
      },
      svg: 'never',
      math: 'never'
    }],
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'never'
    }],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: 5,
      multiline: 4
    }],
    'vue/name-property-casing': ['error', 'kebab-case'],
    // TODO: Add order for custom directives once supported
    'vue/attributes-order': ['error', {
      order: [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'UNIQUE',
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'EVENTS',
        'GLOBAL',
        'OTHER_ATTR',
        'CONTENT'
      ]
    }],
    'vue/order-in-components': ['error', {
      order: [
        'el',
        'name',
        ['template', 'render', 'renderError'],
        ['parent','functional', 'delimiters', 'comments'],
        'extends',
        'mixins',
        'inheritAttrs',
        'model',
        ['props', 'propsData'],
        'data',
        'computed',
        'methods',
        'watch',
        'LIFECYCLE_HOOKS',
        ['directives', 'filters'],
        'components'
      ]
    }]
  },
  globals: {
    BRAND_CONFIG: true
  }
};
