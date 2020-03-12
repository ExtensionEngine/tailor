'use strict';

const dargs = require('dargs');
const minimist = require('minimist');
const path = require('path');
const safeRequire = require('safe-require');

const actions = [
  'migrate',
  'seed',
  'create',
  'drop'
];
const isAction = cmd => actions.some(it => cmd.startsWith(it));

// Load config.
const config = safeRequire(path.join(process.cwd(), 'sequelize.config.js'));
if (!config) {
  console.error('Error: `sequelize.config.js` not found');
  process.exit(1);
}

const argv = minimist(process.argv.slice(2));
process.argv.length = 2;

// Resolve command with arguments.
const args = getArgs(argv);
process.argv.push(...args);

// Resolve options.
const options = Object.assign({}, config, getOptions(argv));
process.argv.push(...dargs(options));

// Make it rain!
// eslint-disable-next-line require-sort/require-sort
require('sequelize-cli/lib/sequelize');

function getArgs(argv) {
  let [cmd, ...args] = argv._;
  if (!cmd) return args;
  if (isAction(cmd)) cmd = `db:${cmd}`;
  return [cmd, ...args];
}

function getOptions(argv) {
  return reduce(argv, (acc, val, key) => {
    if (['_', '--'].includes(key)) return acc;
    return Object.assign(acc, { [key]: val });
  }, {});
}

function reduce(obj, callback, initalValue) {
  return Object.keys(obj).reduce((acc, key) => {
    return callback(acc, obj[key], key);
  }, initalValue);
}
