'use strict';

const chai = require('chai');
const sinon = require('sinon');
const DatabaseConnector = require('../connector').DatabaseConnector;

sinon.assert.expose(chai.assert, { prefix: '' });
const assert = chai.assert;

describe('DatabaseConnector', () => {
  function getMocks() {
    return {
      config: {
        name: 'some-database',
        collections: ['user', 'role', 'blog', 'comment']
      }
    };
  }

  describe('initialize', () => {
    it('makes sure database and all required collections exist', done => {
      const { config } = getMocks();
      const db = { key: 'value' };
      const connector = new DatabaseConnector(db, config);
      connector.ensureDatabase = sinon.stub().returns(Promise.resolve());
      connector.ensureCollections = sinon.stub().returns(Promise.resolve());

      connector.initialize()
        .then(result => {
          assert.calledWithExactly(connector.ensureDatabase, config.name);
          assert.calledWithExactly(connector.ensureCollections, config.collections);
          // Just make sure we get the (opaque) database object back:
          assert.deepEqual(result, db);
        })
        .then(done)
        .catch(done);
    });
  });

  describe('ensureDatabase', () => {
    it('creates the missing database and activates it', done => {
      const { config } = getMocks();
      const db = {
        listUserDatabases: sinon.stub().returns(Promise.resolve([
          'existing-db1', 'existing-db2', 'existing-db3'
        ])),
        createDatabase: sinon.stub().returns(Promise.resolve()),
        useDatabase: sinon.spy()
      };
      const connector = new DatabaseConnector(db);

      connector.ensureDatabase(config.name)
        .then(() => {
          assert.calledWithExactly(db.createDatabase, config.name);
          assert.calledWithExactly(db.useDatabase, config.name);
        })
        .then(done)
        .catch(done);
    });

    it('activates the existing database', done => {
      const { config } = getMocks();
      const db = {
        listUserDatabases: sinon.stub().returns(Promise.resolve([
          'existing-db1', 'existing-db2', config.name
        ])),
        createDatabase: sinon.spy(),
        useDatabase: sinon.spy()
      };
      const connector = new DatabaseConnector(db);

      connector.ensureDatabase(config.name)
        .then(() => {
          assert.notCalled(db.createDatabase);
          assert.calledWithExactly(db.useDatabase, config.name);
        })
        .then(done)
        .catch(done);
    });
  });

  describe('ensureCollections', () => {
    it("creates all configured collections which don't yet exist", done => {
      const { config } = getMocks();
      const create = sinon.stub().returns(Promise.resolve());
      const db = {
        listCollections: sinon.stub().returns(Promise.resolve([
          { name: config.collections[0] },
          { name: config.collections[1] }
        ])),
        collection: sinon.stub().returns({ create })
      };
      const connector = new DatabaseConnector(db);

      connector.ensureCollections(config.collections)
        .then(() => {
          assert.calledTwice(create);
          assert.calledTwice(db.collection);
          assert.calledWithExactly(db.collection, config.collections[2]);
          assert.calledWithExactly(db.collection, config.collections[3]);
        })
        .then(done)
        .catch(done);
    });
  });
});
