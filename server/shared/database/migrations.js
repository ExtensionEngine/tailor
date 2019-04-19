'use strict';

const Umzug = require('umzug');

const isProduction = process.env.NODE_ENV === 'production';
const noop = () => {};

const isFunction = arg => typeof arg === 'function';

module.exports = (sequelize, { path, logger = {} }) => {
  const log = isFunction(logger.info) ? logger.info.bind(logger) : noop;
  const params = [sequelize.getQueryInterface(), sequelize.Sequelize];
  const tableName = sequelize.options.migrationStorageTableName;
  const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: { sequelize, tableName },
    migrations: { path, params },
    logging
  });

  umzug.on('migrating', migration => log({ migration }, '⬆️  Migrating:', migration));
  umzug.on('migrated', migration => log({ migration }, '⬆️  Migrated:', migration));
  umzug.on('reverting', migration => log({ migration }, '⬇️  Reverting:', migration));
  umzug.on('reverted', migration => log({ migration }, '⬇️  Reverted:', migration));

  return { run };

  async function run() {
    if (!isProduction) await umzug.up();
    const migrations = (await umzug.executed()).map(it => it.file);
    if (!migrations.length) return;
    log({ migrations }, '🗄️  Executed migrations:\n', migrations.join('\n'));
  }

  function logging(message) {
    if (message.startsWith('==')) return;
    if (!message.startsWith('File:')) return log(message);
    const [, file] = message.split(/\s+/g);
    return log({ file }, message);
  }
};
