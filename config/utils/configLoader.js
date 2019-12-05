'use strict';

const argv = require('minimist')(process.argv.slice(2));
const dedent = require('dedent');
const deprecate = require('depd')('config');
const JoyCon = require('joycon');
const path = require('path');
const { readFileSync } = require('fs');
const stripJsonComments = require('strip-json-comments');

const isObject = arg => arg !== null && typeof arg === 'object';
const parseJSON = input => JSON.parse(stripJsonComments(input));

const joycon = new JoyCon({
  parseJSON,
  stopDir: path.dirname(process.cwd())
});
joycon.addLoader({
  test: /\.[^.]*rc$/,
  loadSync: path => parseJSON(readFileSync(path, 'utf-8'))
});

module.exports = function configLoader(name, options) {
  return function () {
    const config = loadConfig(name, options);
    const isWebpack = arguments.length > 0;
    if (!isWebpack) return config;
    return { code: createModule(config) };
  };
};

function createModule(obj) {
  return `module.exports = () => (${JSON.stringify(obj, null, 2)});`;
}

function loadConfig(name, options) {
  const defaultFiles = [
    `${name}.config.js`,
    `.${name}rc.js`,
    `.${name}rc`,
    `.${name}rc.json`
  ];
  // TODO: Remove support for legacy configuration files.
  const legacyFiles = [
    'activities.config.js',
    '.activities-rc',
    '.activities-rc.json'
  ];
  const configPath = getConfigPath(options);
  const files = configPath
    ? [path.resolve(configPath)]
    : defaultFiles.concat(legacyFiles);
  const result = joycon.loadSync(files);
  if (result.path) result.filename = path.basename(result.path);
  if (!configPath && legacyFiles.includes(result.filename)) {
    deprecate(dedent`Using legacy configuration file: ${result.filename}
      Supported configuration files: ${defaultFiles.join(', ')}`);
  }
  if (result.path && !isObject(result.data)) {
    throw new Error(`Invalid configuration file: ${configPath || result.filename}`);
  }
  if (configPath && !result.data) {
    throw new Error(`Failed to load configuration file: ${configPath}`);
  }
  return result.data;
}

function getConfigPath({ flag, envVar } = {}) {
  let configPath;
  if (flag) {
    configPath = argv[flag];
  }
  if (!configPath && envVar) {
    configPath = process.env[envVar.toUpperCase()] ||
      process.env[envVar.toLowerCase()];
  }
  return configPath;
}
