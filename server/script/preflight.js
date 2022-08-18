
import 'dotenv/config';
import boxen from 'boxen';
import { readPackageUp } from 'read-pkg-up';
import semver from 'semver';

const pkg = await readPackageUp();

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
