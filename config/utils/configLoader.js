'use strict';

const dedent = require('dedent');
const deprecate = require('depd')('config');
const { flags } = require('minimost')(process.argv.slice(2));
const JoyCon = require('joycon');
const path = require('path');
const pkg = require('../../package.json');
const { readFileSync } = require('fs');
const stripJsonComments = require('strip-json-comments');
const to = require('to-case');

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

module.exports = function configLoader(name) {
  return function () {
    const config = loadConfig(name);
    const isWebpack = arguments.length > 0;
    if (!isWebpack) return config;
    return { code: createModule(config) };
  };
};

function createModule(obj) {
  return `module.exports = () => (${JSON.stringify(obj, null, 2)});`;
}

function loadConfig(name) {
  const flag = to.camel([name, 'config'].join('_'));
  const envVar = to.constant([pkg.name, name, 'config'].join('_'));
  const configPath = flags[flag] || process.env[envVar];
  const defaultFiles = [
    `${name}.config.js`,
    `.${name}rc.js`,
    `.${name}rc`,
    `.${name}rc.json`
  ];
  // TODO: Remove support for legacy configuration files.
  const legacyFiles = [
    `.${name}-rc`,
    `.${name}-rc.json`
  ];
  const files = configPath
    ? [path.resolve(configPath)]
    : defaultFiles.concat(legacyFiles);
  const result = joycon.loadSync(files);
  if (result.path) result.filename = path.basename(result.path);
  if (legacyFiles.includes(result.filename)) {
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
