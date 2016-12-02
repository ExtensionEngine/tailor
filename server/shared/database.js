'use strict';

const arangojs = require('arangojs');
const config = require('../../config/server');

// TODO(matej): load required collections from model files.
config.database.collections = ['course'];

/** Utility class for initializing ArangoDB. */
class DatabaseConnector {
  /**
   * Create the connector instance. Typically you'll only need one of these.
   * @param {object} arangoInstance - an object encapsuling all arangojs
   * functionality; created by calling arangojs().
   * @param {object} dbConfig - configuration details.
   * @param {string} dbConfig.name - database name. All data will be persisted
   * to this Arango database.
   * @param {string} dbConfig.collections[] - array of collection names. These
   * collections must exist for app to work.
   */
  constructor(arangoInstance, dbConfig) {
    this.db = arangoInstance;
    this.config = dbConfig;
  }

  /**
   * Create the database and all collections specified in dbConfig.
   * @return {Promise<object>} A db object used to call all ArangoDB methods
   * (as listed here: https://www.npmjs.com/package/arangojs#table-of-contents).
   */
  initialize() {
    return this.ensureDatabase(this.config.name)
      .then(() => this.ensureCollections(this.config.collections))
      .then(() => this.db);
  }

  /**
   * Make sure database with given name exists.
   * @private
   * @param {string} name - database name.
   */
  ensureDatabase(name) {
    return this.db.listUserDatabases()
      .then(databases => databases.includes(name) ? null : this.db.createDatabase(name))
      .then(result => this.db.useDatabase(name));
  }

  /**
   * Make sure database contains all given collections. Collections that don't
   * exist yet will be created; existing collections are left untouched.
   * @private
   * @param {string} names[] - array of collection names.
   */
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
