import api from '@/api/activeUsers';
import generateActions from '@/store/helpers/actions';
import SSEClient from '@/SSEClient';
import urlJoin from 'url-join';

const { setEndpoint } = generateActions();
const baseUrl = process.env.API_PATH;
const feed = new SSEClient();

const Events = {
  Add: 'active_user:add',
  Remove: 'active_user:remove',
  RemoveSession: 'active_user:remove_session'
};

const subscribe = ({ commit, rootState }) => {
  const { courseId } = rootState.route.params;
  const token = localStorage.getItem('JWT_TOKEN');
  const params = { token };
  const url = urlJoin(baseUrl, api.url.root(courseId), '/subscribe');
  if (feed.isConnected) return;
  feed
    .connect(url, { params })
    .subscribe(Events.Add, ({ user, context }) => {
      commit('sseAdd', { user, context });
    })
    .subscribe(Events.Remove, ({ user, context }) => {
      commit('sseRemove', { user, context });
    })
    .subscribe(Events.RemoveSession, ({ userId, sseId }) => {
      commit('sseRemoveSession', { userId, sseId });
    })
    .subscribe('connection_initialized', ({ sseId }) => {
      commit('setSseId', sseId);
    });
};

const unsubscribe = () => feed.disconnect();

const fetch = ({ commit }, courseId) => {
  return api.fetch(courseId)
    .then(({ activeUsers }) => commit('save', activeUsers));
};

const add = (_, context) => {
  return api.add(context);
};

const remove = (_, context) => {
  return api.remove(context);
};

export {
  setEndpoint,
  add,
  fetch,
  remove,
  subscribe,
  unsubscribe
};
