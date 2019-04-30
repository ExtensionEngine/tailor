'use strict';

const { execFileSync } = require('child_process');

const execSync = (cmd, args, opts) => execFileSync(cmd, args, opts).toString().trim();
const forEach = (obj, cb) => Object.keys(obj).forEach(key => cb(obj[key], key));
const isObject = arg => arg !== null && typeof arg === 'object';

exports.name = 'html-version-spec';

exports.apply = ({ config, pkg }) => {
  const meta = {
    get version() {
      return getVersion(pkg);
    }
  };
  if (isObject(config.html)) {
    return Object.assign(config.html, { meta });
  }
  if (isObject(config.pages)) {
    return forEach(config.pages, page => Object.assign(page, { meta }));
  }
};

function getVersion(pkg) {
  const semver = pkg.data.version;
  try {
    const rev = execSync('git', ['rev-parse', '--short', 'HEAD']);
    return `${semver}-rev-${rev}`;
  } catch (err) {
    console.error(err);
  }
  return `${semver}`;
}
