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
  if (isObject(config.pages)) {
    return forEach(config.pages, page => Object.assign(page, { meta }));
  }
  const { output } = config;
  output.html = output.html || {};
  Object.assign(output.html, { meta });
};

function getVersion(pkg) {
  const { codename, version } = pkg.data;
  try {
    const rev = execSync('git', ['rev-parse', '--short', 'HEAD']);
    return `${version}-rev-${rev} (${codename})`;
  } catch (err) {
    console.error(err);
  }
  return `${version} (${codename})`;
}
