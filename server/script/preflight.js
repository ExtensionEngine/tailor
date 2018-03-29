const argv = require('minimist')(process.argv.slice(2));
const boxen = require('boxen');
const path = require('path');
const pkg = require('read-pkg-up').sync().pkg;
const semver = require('semver');

const engines = pkg.engines || {};
const script = argv._[0];

(function preflight() {
  if (!engines.node) return run(script);
  const checkPassed = semver.satisfies(process.versions.node, engines.node);
  if (checkPassed) return run(script);
  warn(engines.node);
  console.error(' ✋  Exiting due to engine requirement check failure...\n');
  process.exit(1);
}());

function run(script) {
  if (!script) return;
  const cwd = process.cwd();
  const target = path.resolve(cwd, script);
  return require(target);
}

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
