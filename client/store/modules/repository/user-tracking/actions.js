import { feed as api } from '@extensionengine/tailor-api';
import feed from '../feed';
import { UserActivity } from '@/../common/sse';

const plugSSE = ({ commit }) => {
  feed
    .subscribe(UserActivity.Start,
      ({ user, context }) => commit('start', { user, context }))
    .subscribe(UserActivity.End,
      ({ user, context }) => commit('end', { user, context }))
    .subscribe(UserActivity.EndSession,
      ({ sseId, userId }) => commit('endSession', { sseId, userId }));
};

const start = ({ rootState }, context) => {
  const { sseId, repositoryId } = rootState.repository;
  return api.start({ sseId, repositoryId, ...context });
};

const end = ({ rootState }, context) => {
  const { sseId, repositoryId } = rootState.repository;
  return api.end({ sseId, repositoryId, ...context });
};

const fetch = ({ commit }, repositoryId) => {
  return api.fetch(repositoryId).then(({ items }) => commit('fetch', items));
};

export {
  plugSSE,
  fetch,
  start,
  end
};
