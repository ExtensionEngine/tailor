const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  root: true,
  parserOptions: { sourceType: 'module' },
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
      //       ESlint calculated indentation start IS NOT!
      // https://eslint.org/docs/rules/indent#memberexpression
      MemberExpression: 'off'
    }],
    'arrow-parens': 'off',
    'comma-dangle': ['warn', 'never'],
    'no-debugger': isDev ? 'warn' : 'error',
    'no-unreachable': isDev ? 'warn' : 'error',
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never'
    }],
    // 'sort-imports': ['error', {
    //   'ignoreCase': true,
    //   'ignoreMemberSort': false
    // }]
    // Vue rules
    'vue/html-self-closing': 0,
    'vue/attribute-hyphenation': 0,
    'vue/max-attributes-per-line': [2, { singleline: 5 }],
    'vue/name-property-casing': [2, 'kebab-case'],
    // TODO: Add order for custom directives once supported
    'vue/attributes-order': [2, {
      order: [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'UNIQUE',
        'BINDING',
        'EVENTS',
        'CONTENT',
        'GLOBAL',
        'OTHER_ATTR'
      ]
    }],
    'vue/order-in-components': [2, {
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
        'LIFECYCLE_HOOKS',
        'watch',
        ['directives', 'filters'],
        'components'
      ]
    }]
  },
  globals: {
    BRAND_CONFIG: true
  }
};
