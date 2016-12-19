'use strict';

const noop = require('lodash/noop');
const Store = require('express-session').Store;
const database = require('../shared/database');
const query = require('./query');

const db = database.db;
const SESSION_COLLECTION = database.collection.SESSION;

// https://ewiggin.gitbooks.io/expressjs-middleware/content/express-session.html

class ArangoSessionStore extends Store {
  constructor(db, collectionName = SESSION_COLLECTION) {
    super();
    this.db = db;
    this.collectionName = collectionName;
  }

  get(sid, callback) {
    this.db
      .query(query.GET_SESSION_BY_KEY, {
        '@sessionCollection': this.collectionName,
        sessionKey: sid
      })
      .then(cursor => cursor.next())
      .then(session => callback(null, session))
      .catch(callback);
  }

  set(sid, session, callback = noop) {
    this.db
      .query(query.UPSERT_SESSION_BY_KEY, {
        '@sessionCollection': this.collectionName,
        sessionKey: sid,
        sessionData: session
      })
      .then(cursor => cursor.next())
      .then(session => callback(null, session))
      .catch(callback);
  }

  destroy(sid, callback = noop) {
    this.db
      .query(query.REMOVE_SESSION_BY_KEY, {
        '@sessionCollection': this.collectionName,
        sessionKey: sid
      })
      .then(cursor => cursor.next())
      .then(session => callback(null, session))
      .catch(callback);
  }
}

module.exports = {
  ArangoSessionStore,
  arangoSessionStore: new ArangoSessionStore(db)
};
