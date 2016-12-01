'use strict';

const arangojs = require('arangojs');
const config = require('../config/server');

const db = arangojs(config.database.uri);

function ensureDatabase(name) {
  return db.listUserDatabases()
    .then(databases => databases.includes(name) ? null : db.createDatabase(name))
    .then(result => db.useDatabase(name));
}

function ensureCollections(names) {
  return db.listCollections()
    .then(collections => {
      const existingNames = collections.map(c => c.name);
      const missingNames = [];
      for (const name of names) {
        if (!existingNames.includes(name)) missingNames.push(name);
      }

      const promises = missingNames.map(name => db.collection(name).create());
      return Promise.all(promises);
    });
}

function initialize() {
  return ensureDatabase(config.database.name)
    // TODO(matej): load required collections from model files.
    .then(() => ensureCollections(['course']))
    .then(() => db);
}

module.exports = {
  db,
  initialize
};
