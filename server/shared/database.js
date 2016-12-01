'use strict';

const arangojs = require('arangojs');
const config = require('../../config/server');

class DatabaseConnector {
  constructor(arangoInstance, dbConfig) {
    this.db = arangoInstance;
    this.config = dbConfig;
  }

  initialize() {
    return this.ensureDatabase(this.config.name)
      // TODO(matej): load required collections from model files.
      .then(() => this.ensureCollections(['course']))
      .then(() => this.db);
  }

  ensureDatabase(name) {
    return this.db.listUserDatabases()
      .then(databases => databases.includes(name) ? null : this.db.createDatabase(name))
      .then(result => this.db.useDatabase(name));
  }

  ensureCollections(names) {
    return this.db.listCollections()
      .then(collections => {
        const existingNames = collections.map(c => c.name);
        const missingNames = [];
        for (const name of names) {
          if (!existingNames.includes(name)) missingNames.push(name);
        }

        const promises = missingNames.map(name => this.db.collection(name).create());
        return Promise.all(promises);
      });
  }
}

const db = arangojs(config.database.uri);

module.exports = {
  db,
  DatabaseConnector,
  databaseConnector: new DatabaseConnector(db, config.database)
};
