'use strict';

const boxen = require('boxen');
const { packageJson: pkg } = require('read-pkg-up').sync();
const semver = require('semver');

require('dotenv').config();

(function preflight() {
  const engines = pkg.engines || {};
  if (!engines.node) return;
  const checkPassed = semver.satisfies(process.versions.node, engines.node);
  if (checkPassed) return;
  warn(engines.node);
  console.error(' ✋  Exiting due to engine requirement check failure...\n');
  process.exit(1);
}());

function warn(range, current = process.version, name = pkg.name) {
  const options = {
    borderColor: 'red',
    borderStyle: 'single',
    padding: 1,
    margin: 1,
    float: 'left',
    align: 'center'
  };
  const message = `🚨  ${name} requires node ${range}\n current version is ${current}`;
  console.error(boxen(message, options));
}
