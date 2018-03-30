const { exec } = require('child_process');
const { slug } = require('to-case');

const map = require('lodash/map');
const migrate = require('../shared/database/migrate');

run(process.argv.slice(2), {
  migrationsPath: './server/shared/database/migrations',
  config: './config/server/database.js'
});

function run([command, arg], options) {
  if (command === 'to') return migrate(arg).then(() => process.exit(0));
  if (command === 'create') {
    if (arg) options.name = arg;
    const cmd = ['sequelize migration:create', ...getFlags(options)];
    return execCmd(cmd.join(' '));
  }

  printUsage();
  process.exit(0);
}

function execCmd(cmd) {
  return exec(cmd, (err, stdout, stderr) => {
    if (!err) {
      process.stdout.write(stdout);
      process.stderr.write(stderr);
      process.exit(0);
    }
    console.error(err.message);
    console.error(err.stack);
    process.exit(1);
  });
}

function getFlags(options) {
  return map(options, (value, name) => `--${slug(name)}="${value}"`);
}

function printUsage() {
  console.log(`Invalid usage. Valid commands are:\n
  migrate create [migration-name]
  migrate to [version]`);
}
