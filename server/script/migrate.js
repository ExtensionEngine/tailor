'use strict';

const exec = require('child_process').exec;
const args = process.argv.slice(2);

let cmd = 'sequelize ';
const configOption = ' --config "./config/server/database.js"';
const migrationsPathOption = ' --migrations-path "./server/shared/database/migrations"';

if (args[0] === 'create') {
  const migrationName = args[1];
  const nameOption = migrationName ? ` --name="${migrationName}"` : '';
  cmd = cmd + 'migration:create' + configOption + migrationsPathOption + nameOption;
} else if (args[0] === 'up') {
  cmd = cmd + 'db:migrate' + configOption + migrationsPathOption;
} else if (args[0] === 'down') {
  cmd = cmd + 'db:migrate:undo' + configOption + migrationsPathOption;
} else {
  console.log('Invalid usage. Valid commands are:');
  console.log('migrate create [migration-name]');
  console.log('migrate up');
  console.log('migrate down');
  process.exit();
}

exec(cmd, error => {
  if (error) console.log(error);
  else console.log('Command successfully executed!');
});
