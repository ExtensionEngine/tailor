'use strict';

const Promise = require('bluebird');
const store = require('../../shared/store');

const getKey = id => `active-user-${id}`;

async function addContext(user, context) {
  const key = getKey(user.id);
  const record = await findOrCreate(user);
  const contexts = [...record.contexts, context];
  return store.set(key, { ...record, contexts });
}

async function removeContext(user, predicate) {
  const key = getKey(user.id);
  const record = await store.get(key);
  if (!record) return;
  const contexts = record.contexts.filter(it => !predicate(it));
  if (contexts.length <= 0) return store.delete(key);
  return store.set(key, { ...record, contexts });
}

async function getActiveUsers() {
  const activeUserKeys = await store.getKeys('active-user-*');
  return Promise
    .map(activeUserKeys, key => store.get(key))
    .reduce((acc, user) => ({ ...acc, [user.id]: user }), {});
}

async function findOrCreate(user) {
  const key = getKey(user.id);
  const hasKey = await store.has(key);
  if (!hasKey) {
    const connectedAt = new Date();
    await store.set(key, { ...user, connectedAt, contexts: [] });
  }
  return store.get(key);
}

module.exports = { addContext, removeContext, getActiveUsers };
