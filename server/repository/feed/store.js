import config from '../../../config/server/index.js';
import Promise from 'bluebird';
import Tapster from '@extensionengine/tapster';

const { provider, ...options } = config.store;

const store = new Tapster({
  ...options[provider],
  store: provider,
  namespace: 'active-users',
  ttl: 40
});

async function addContext(user, context) {
  const record = await findOrCreate(user);
  const contexts = [...record.contexts, context];
  return store.set(user.id, { ...record, contexts });
}

async function removeContext(user, predicate) {
  const record = await store.get(user.id);
  if (!record) return;
  const contexts = record.contexts.filter(it => !predicate(it));
  if (!contexts.length) return store.delete(user.id);
  return store.set(user.id, { ...record, contexts });
}

async function getActiveUsers() {
  const activeUserKeys = await store.getKeys();
  return Promise
    .map(activeUserKeys, key => store.get(key))
    .filter(Boolean)
    .reduce((acc, user) => ({ ...acc, [user.id]: user }), {});
}

async function findOrCreate(user) {
  const hasKey = await store.has(user.id);
  if (!hasKey) {
    const connectedAt = new Date();
    await store.set(user.id, { ...user, connectedAt, contexts: [] });
  }
  return store.get(user.id);
}

export { addContext, removeContext, getActiveUsers };
