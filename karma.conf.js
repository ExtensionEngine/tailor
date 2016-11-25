const projectRoot = require('./config/helpers/projectRoot');
const webpackConfig = require('./config/webpack/test.js');

const CLIENT_TEST_PATH = projectRoot('client', 'test', 'unit', 'specs');

module.exports = function (config) {
  config.set({
    // Base path used to resolve all defined patterns (files, exclude etc.)
    basePath: CLIENT_TEST_PATH,

    // List of browsers to launch and capture
    browsers: ['PhantomJS'],

    // List of frameworks used for testing
    frameworks: ['mocha', 'sinon-chai'],

    // List of additional reporters
    reporters: ['spec', 'coverage'],

    // List of files / patterns to execute
    files: [
      { pattern: '*.spec.js', watched: false }
    ],

    // List of preprocessors to apply
    preprocessors: {
      '*.spec.js': ['webpack', 'sourcemap']
    },

    // Run only once instead of watching
    singleRun: true,

    // Use base webpack config
    webpack: webpackConfig,

    // Apply webpack middleware
    webpackMiddleware: {
      noInfo: true
    },

    // Coverage config, target dir etc.
    coverageReporter: {
      dir: projectRoot('client', 'test', 'unit', 'coverage'),
      reporters: [
        {
          type: 'lcov',
          dir: 'coverage',
          subdir: 'lcov'
        },
        {
          type: 'text-summary'
        }
      ]
    }
  });
};
