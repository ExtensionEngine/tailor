'use strict';

const path = require('path');

/** @type {import('bili').Config} */
module.exports = {
  input: {
    'tce-utils': 'src/index.js'
  },
  output: {
    format: ['cjs', 'es', 'umd', 'umd-min'],
    moduleName: 'TceUtils'
  },
  plugins: {
    vue: true,
    babel: {
      sourceMap: true,
      extensions: ['.js']
    },
    '@rollup/plugin-alias': {
      resolve: ['.js'],
      entries: [
        { find: '@', replacement: path.resolve(__dirname, './src') }
      ]
    },
    visualizer: {
      sourceMap: true,
      open: false
    }
  }
};
