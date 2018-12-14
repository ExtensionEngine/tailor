'use strict';

const findIndex = require('lodash/findIndex');
const flatten = require('lodash/flatten');
const map = require('lodash/map');
const umzug = require('./umzug');

const changelog = [];

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
