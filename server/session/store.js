'use strict';

const noop = require('lodash/noop');
const Store = require('express-session').Store;
const database = require('../shared/database');
const query = require('./query');

const db = database.db;
const SESSION_COLLECTION = database.collection.SESSION;

/**
 * ExpressJS session store backed by ArangoDB. Implements the minimum required
 * interface described in the docs:
 * {@link https://ewiggin.gitbooks.io/expressjs-middleware/content/express-session.html#session-store-implementation}
 */
class ArangoSessionStore extends Store {
  /**
   * Create the store instance.
   * @param {object} db - JS interface/connection to ArangoDB, as received
   * from {@link DatabaseConnector}
   * @param {string} collectionName - Name of the collection which will store
   * the session data.
   */
  constructor(db, collectionName = SESSION_COLLECTION) {
    super();
    this.db = db;
    this.collectionName = collectionName;
  }

  /**
   * Get the session data from database.
   * @param {string} sid - Session ID.
   */
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

  /**
   * Save the session data to database.
   * @param {string} sid - Session ID.
   * @param {object} session - Arbitrary session data in JSON format.
   * @param {function} [callback=noop] - Callback called when session is saved.
   */
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

  /**
   * Remove the session from database.
   * @param {string} sid - Session ID.
   * @param {function} [callback=noop] - Called when session is destroyed.
   */
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
