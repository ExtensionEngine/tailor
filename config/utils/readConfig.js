'use strict';

const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const rcfile = require('rcfile');

module.exports = function readConfig(name) {
  const configPath = argv.activitiesConfig || process.env.activitiesConfig;
  try {
    const cwd = path.join(__dirname, '../../');
    return rcfile(`${name}-`, { cwd, configFileName: configPath });
  } catch (err) {
    return {};
  }
};
