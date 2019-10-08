'use strict';

const { execFileSync } = require('child_process');

const execSync = (cmd, args, opts) => execFileSync(cmd, args, opts).toString().trim();

module.exports = (api, config) => {
  const { pkg } = api.service;
  const meta = {
    get version() {
      return getVersion(pkg);
    }
  };
  Object.values(config.pages).forEach(page => Object.assign(page, { meta }));
};

function getVersion(pkg) {
  const { codename, version } = pkg;
  try {
    const rev = execSync('git', ['rev-parse', '--short', 'HEAD']);
    return `${version}-rev-${rev} (${codename})`;
  } catch (err) {
    console.error(err);
  }
  return `${version} (${codename})`;
}
