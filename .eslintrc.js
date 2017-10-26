const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: { sourceType: 'module' },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: ['html'],
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    // warn if there is a trailing comma
    'comma-dangle': ['warn', 'never'],
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': isDev ? 'warn' : 'error',
    // allow dead code during development
    'no-unreachable': isDev ? 'warn' : 'error',
    // semicolons are necessary
    'semi': ['warn', 'always'],
    // add space before function parameters
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never'
    }],
    // 'sort-imports': ['error', {
    //   'ignoreCase': true,
    //   'ignoreMemberSort': false
    // }]
  }
};
