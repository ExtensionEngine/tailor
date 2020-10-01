import { Connection, UserActivity } from '@/../common/sse';
import api from '@/api/userTracking';
import SSEClient from '@/SSEClient';
import urlJoin from 'url-join';

const baseUrl = process.env.API_PATH;
const feed = new SSEClient();

const subscribe = ({ rootState, commit }, repositoryId) => {
  if (feed.isConnected) return;
  const url = urlJoin(baseUrl, api.urls.subscribe(repositoryId));
  feed
    .connect(url, { params: { token: rootState.auth.token } })
    .subscribe(UserActivity.Start,
      ({ user, context }) => commit('start', { user, context }))
    .subscribe(UserActivity.End,
      ({ user, context }) => commit('end', { user, context }))
    .subscribe(UserActivity.EndSession,
      ({ sseId, userId }) => commit('endSession', { sseId, userId }))
    .subscribe(Connection.Initialized, e => commit('setSseId', e.sseId));
};

const unsubscribe = ({ commit }) => {
  feed.disconnect();
  commit('reset');
  commit('setSseId', null);
};

const fetch = ({ commit }, repositoryId) => {
  return api.fetch(repositoryId).then(({ items }) => commit('fetch', items));
};

const start = (_, context) => api.start(context);
const end = (_, context) => api.end(context);

export {
  subscribe,
  unsubscribe,
  fetch,
  start,
  end
};
