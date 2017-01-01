const GET_SESSION_BY_KEY = `
FOR session IN @@sessionCollection
  FILTER session._key == @sessionKey
  RETURN session`;

const UPSERT_SESSION_BY_KEY = `
UPSERT { _key: @sessionKey }
INSERT MERGE({ _key: @sessionKey }, @sessionData)
UPDATE @sessionData IN @@sessionCollection
RETURN NEW`;

const REMOVE_SESSION_BY_KEY = `
FOR session IN @@sessionCollection
  FILTER session._key == @sessionKey
  REMOVE session IN @@sessionCollection
  RETURN OLD`;

module.exports = {
  GET_SESSION_BY_KEY,
  REMOVE_SESSION_BY_KEY,
  UPSERT_SESSION_BY_KEY
};
