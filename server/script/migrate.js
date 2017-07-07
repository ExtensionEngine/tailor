'use strict';

const isEqual = require('lodash/isEqual');
const exec = require('child_process').exec;
const args = process.argv.slice(2);

let cmd = ['sequelize'];
const cmdName = args[0];
const migrationName = args[1];
const configOption = '--config "./config/server/database.js"';
const migrationsPathOption = '--migrations-path "./server/shared/database/migrations"';

cmd = cmdName === 'create' ? [...cmd, 'migration:create'] : cmd;
cmd = cmdName === 'create' && migrationName ? [...cmd, `--name="${migrationName}"`] : cmd;
cmd = cmdName === 'up' ? [...cmd, 'db:migrate'] : cmd;
cmd = cmdName === 'down' ? [...cmd, 'db:migrate:undo'] : cmd;

function printUsage() {
  console.log('Invalid usage. Valid commands are:');
  console.log('\tmigrate create [migration-name]');
  console.log('\tmigrate up');
  console.log('\tmigrate down');
  process.exit();
}

cmd = !isEqual(cmd, ['sequelize'])
  ? [...cmd, configOption, migrationsPathOption]
  : printUsage();

exec(cmd.join(' '), error => {
  if (error) console.log(error);
  else console.log('Command executed successfully!');
});
