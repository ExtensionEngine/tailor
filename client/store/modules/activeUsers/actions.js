import api from '@/api/activeUsers';
import forEach from 'lodash/forEach';
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

const subscribe = ({ state, commit, rootState }) => {
  const { repositoryId } = rootState.route.params;
  const params = { token: rootState.auth.token };
  const url = urlJoin(baseUrl, api.url.subscribe(repositoryId));
  if (feed.isConnected) return;
  feed
    .connect(url, { params })
    .subscribe(Events.Add, ({ user, context }) => {
      assignPalette(user);
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

const unsubscribe = ({ commit }) => {
  feed.disconnect();
  commit('resetActiveUsers');
  commit('setSseId', null);
};

const fetch = ({ commit }, repositoryId) => {
  return api.fetch(repositoryId)
    .then(({ activeUsers }) => {
      forEach(activeUsers, user => {
        assignPalette(user);
        commit('save', user);
      });
    });
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

function assignPalette(user, activeUsers) {
  const randomId = Math.floor(Math.random() * 1000);
  const randomBackground = Math.floor(Math.random() * 16777215).toString(16);
  const randomBorder = Math.floor(Math.random() * 16777215).toString(16);
  const colorPalette = {
    id: randomId,
    background: '#' + randomBackground,
    text: '#fff',
    border: '#' + randomBorder
  };
  user.palette = colorPalette;
}
