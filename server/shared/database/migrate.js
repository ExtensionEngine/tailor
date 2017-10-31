const db = require('./index');
const findIndex = require('lodash/findIndex');
const flatten = require('lodash/flatten');
const map = require('lodash/map');
const Umzug = require('umzug');

const changelog = [{
  name: '2.0',
  migrations: [
    '20171026141155-clone-support',
    '20171026141409-remove-activity-name',
    '20171028170417-course-schema'
  ]
}];

const umzug = new Umzug({
  // Possible values: 'json', 'sequelize', an argument for `require()`
  storage: 'json',
  storageOptions: {},
  // The logging function.
  // A function that gets executed everytime migrations start and have ended.
  logging: false,
  migrations: {
    params: [db.sequelize.getQueryInterface(), db.sequelize.constructor, db],
    path: './server/shared/database/migrations'
  }
});

// TODO: Implement migration down
module.exports = function migrate(to, from) {
  const toIndex = findIndex(changelog, { name: to }) + 1;
  const fromIndex = from ? findIndex(changelog, { name: from }) : (toIndex - 1);
  const versions = changelog.slice(fromIndex, toIndex);
  const migrations = flatten(map(versions, 'migrations'));
  return umzug.execute({ migrations, method: 'up' }).then(migrations => {
    console.log(`DB migrated to ${to} version`);
  });
};
