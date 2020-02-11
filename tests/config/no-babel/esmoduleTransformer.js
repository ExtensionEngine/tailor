const babelJest = require('babel-jest')

module.exports = babelJest.createTransformer({
  plugins: ['@babel/plugin-transform-modules-commonjs','@babel/plugin-proposal-class-properties'],
  babelrc: false,
  configFile: false
})
