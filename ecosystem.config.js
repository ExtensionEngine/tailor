'use strict';

require('dotenv').config();

const { execFileSync } = require('child_process');
const { readFileSync } = require('fs');
const kleur = require('kleur');
const path = require('path');
const pkg = require('./package.json');
const toml = require('toml');

const CONFIG_FILE = 'pm2.deploy.toml';
const DEFAULT_ENV = 'development';
const script = require.resolve('./server');

const execSync = (cmd, args, opts) => execFileSync(cmd, args, opts).toString().trim();
const getCurrentBranch = () => execSync('git', ['symbolic-ref', '--short', 'HEAD']);

const code = arg => `\`${arg}\``;
const prefix = (label = 'PM2') => kleur.inverse().bold().yellow(` ${label} `);
const log = (msg, ...args) => msg && console.error([prefix(), msg].join(' '), ...args);

const rePM2ConfigVar = /^PM2_CONFIG_/i;
const config = Object.entries(process.env).reduce((config, [key, value]) => {
  if (!rePM2ConfigVar.test(key)) {
    Object.assign(config.env, { [key]: value });
    return config;
  }
  key = key.toLowerCase().replace(rePM2ConfigVar, '');
  if (key.startsWith('env')) return config;
  Object.assign(config.app, { [key]: value });
  return config;
}, { app: {}, env: {} });

exports.apps = [{
  ...config.app,
  name: config.app.name || pkg.name,
  env_development: { ...config.env, NODE_ENV: 'development' },
  env_production: { ...config.env, NODE_ENV: 'production' },
  script
}];

const deployConfig = loadConfig(path.join(process.cwd(), CONFIG_FILE));
if (!deployConfig) {
  return log(
    'Deployment configuration not found. %s is missing?',
    kleur.white(code(CONFIG_FILE)),
  );
}
const configurations = Object.entries(deployConfig);
if (configurations.length <= 0) {
  return log(
    'No deployment configurations specified, check your %s.',
    kleur.white(code(CONFIG_FILE))
  );
}

exports.deploy = configurations.reduce((acc, [name, config]) => {
  if (!config.env) {
    log(
      `%s is not set, using: %s`,
      kleur.white(code(`${name}.env`)),
      kleur.white(JSON.stringify(DEFAULT_ENV))
    );
    config.env = DEFAULT_ENV;
  }
  const postDeploy = [
    'npm install',
    'npm run build',
    `pm2 startOrRestart ${__filename} --env ${config.env} --update-env`
  ].join(' && ');
  const repo = pkg.repository.url;
  config = Object.assign(config, { repo, 'post-deploy': postDeploy });
  if (!config.ref) {
    const ref = getCurrentBranch();
    log(
      `%s is not set, using current branch: %s`,
      kleur.white(code(`${name}.ref`)),
      kleur.white(JSON.stringify(ref))
    );
    config.ref = ref;
  }
  return Object.assign(acc, { [name]: config });
}, {});

if (require.main === module) {
  log('Generated configuration:\n');
  console.log(JSON.stringify(exports, null, 2));
}

function loadConfig(path) {
  try {
    return toml.parse(readFileSync(path));
  } catch (err) {}
}
