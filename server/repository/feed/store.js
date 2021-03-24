'use strict';

const Promise = require('bluebird');
const store = require('../../shared/store');

const ACTIVE_USERS_NAMESPACE = 'active-user-';
const NO_EXPIRATION_TTL = 0;
const getKey = id => `${ACTIVE_USERS_NAMESPACE}${id}`;

async function addContext(user, context) {
  const key = getKey(user.id);
  const record = await findOrCreate(user);
  const contexts = [...record.contexts, context];
  return store.set(key, { ...record, contexts }, NO_EXPIRATION_TTL);
}

async function removeContext(user, predicate) {
  const key = getKey(user.id);
  const record = await store.get(key);
  if (!record) return;
  const contexts = record.contexts.filter(it => !predicate(it));
  if (!contexts.length) return store.delete(key);
  return store.set(key, { ...record, contexts }, NO_EXPIRATION_TTL);
}

async function getActiveUsers() {
  const activeUserKeys = await store.getKeys(`${ACTIVE_USERS_NAMESPACE}*`);
  return Promise
    .map(activeUserKeys, key => store.get(key))
    .reduce((acc, user) => ({ ...acc, [user.id]: user }), {});
}

async function findOrCreate(user) {
  const key = getKey(user.id);
  const hasKey = await store.has(key);
  if (!hasKey) {
    const connectedAt = new Date();
    await store.set(key, { ...user, connectedAt, contexts: [] }, NO_EXPIRATION_TTL);
  }
  return store.get(key);
}

module.exports = { addContext, removeContext, getActiveUsers };
