import api from '@/api/feed';
import { feed } from '../feed';
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

const start = (_, context) => api.start(context);

const end = (_, context) => api.end(context);

const fetch = ({ commit }, repositoryId) => {
  return api.fetch(repositoryId).then(({ items }) => commit('fetch', items));
};

export {
  plugSSE,
  fetch,
  start,
  end
};
