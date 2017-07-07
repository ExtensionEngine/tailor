'use strict';

const { exec } = require('child_process');
const map = require('lodash/map');
const { slug } = require('to-case');

const argv = process.argv.slice(2);

const options = {
  config: './config/server/database.js',
  migrationsPath: './server/shared/database/migrations'
};

let command = getCommand(argv, options);
if (!command) {
  printUsage();
  process.exit(0);
}

command.unshift('sequelize');
const str = command.join(' ');

exec(str, (err, stdout, stderr) => {
  if (!err) {
    process.stdout.write(stdout);
    process.stderr.write(stderr);
    return;
  }
  console.error(err.message);
  console.error(err.stack);
  process.exit(1);
});

function printUsage() {
  console.log(`Invalid usage. Valid commands are:\n
  migrate create [migration-name]
  migrate up
  migrate down`);
}

function getCommand([command, arg], options) {
  if (command === 'up') return ['db:migrate', ...getFlags(options)];
  if (command === 'down') return ['db:migrate:undo', ...getFlags(options)];
  if (command === 'create') {
    if (arg) options.name = arg;
    return ['migration:create', ...getFlags(options)];
  }
}

function getFlags(options) {
  return map(options, (value, name) => `--${slug(name)}="${value}"`);
}
