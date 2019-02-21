'use strict';

const { execFileSync } = require('child_process');

const execSync = (cmd, args, opts) => execFileSync(cmd, args, opts).toString().trim();

exports.name = 'html-version-spec';

exports.apply = api => {
  api.hook('createWebpackChain', config => {
    if (api.config.output.html === false) return;
    const meta = { version: getVersion(api.pkg) };
    getHtmlPlugins(api.config).forEach(name => {
      config.plugin(name).tap(([args]) => [{ ...args, meta }]);
    });
  });
};

function getHtmlPlugins(config) {
  if (!config.pages) return ['html'];
  return Object.keys(config.pages).map(it => `html-page-${it}`);
}

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
