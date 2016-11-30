/*
* Taken from the original Vue-webpack start
* https://github.com/vuejs-templates/webpack/blob/master/template/build/utils.js
*/
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function cssLoaders(options) {
  options = options || {};

  // generate loader string to be used with extract text plugin
  function generateLoaders(loaders) {
    const sourceLoader = loaders.map(function (loader) {
      let extraParamChar;
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?');
        extraParamChar = '&';
      } else {
        loader = loader + '-loader';
        extraParamChar = '?';
      }

      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '');
    }).join('!');

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract('vue-style-loader', sourceLoader);
    } else {
      return ['vue-style-loader', sourceLoader].join('!');
    }
  }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
  return {
    css: generateLoaders(['css']),
    postcss: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    sass: generateLoaders(['css', 'sass?indentedSyntax']),
    scss: generateLoaders(['css', 'sass']),
    stylus: generateLoaders(['css', 'stylus']),
    styl: generateLoaders(['css', 'stylus'])
  };
};

// Generate loaders for standalone style files (outside of .vue)
function styleLoaders(options) {
  const loaders = cssLoaders(options);
  let output = [];
  for (let extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      loader: loader
    });
  }

  return output;
};

module.exports = {
  cssLoaders,
  styleLoaders
};
