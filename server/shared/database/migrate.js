'use strict';

const db = require('./');
const findIndex = require('lodash/findIndex');
const flatten = require('lodash/flatten');
const map = require('lodash/map');
const umzug = require('./umzug')(db);

const changelog = [{
  name: 'add-meta',
  migrations: ['20181115140943-add-meta-to-teaching-element']
}];

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
