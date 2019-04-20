module.exports = {
  input: {
    'resource-components': 'src/index.js'
  },
  output: {
    format: ['cjs', 'es'],
    extractCss: true,
    sourceMap: true
  },
  plugins: {
    vue: true
  }
};
