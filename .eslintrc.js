const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  root: true,
  parserOptions: { sourceType: 'module' },
  // https://github.com/Flet/eslint-config-semistandard
  extends: 'semistandard',
  // required to lint *.vue files
  plugins: ['html'],
  rules: {
    'arrow-parens': 'off',
    'comma-dangle': ['warn', 'never'],
    indent: ['error', 2, {
      SwitchCase: 1,
      // NOTE: Consistent indentation IS enforced;
      //       ESlint calculated indentation start IS NOT!
      // https://eslint.org/docs/rules/indent#memberexpression
      MemberExpression: 'off'
    }],
    'no-debugger': isDev ? 'warn' : 'error',
    'no-unreachable': isDev ? 'warn' : 'error',
    'prefer-const': 'error',
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never'
    }],
    // 'sort-imports': ['error', {
    //   'ignoreCase': true,
    //   'ignoreMemberSort': false
    // }]
  },
  globals: {
    BRAND_CONFIG: true
  }
};
