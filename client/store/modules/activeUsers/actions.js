import api from '@/api/activeUsers';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import generateActions from '@/store/helpers/actions';
import { getUsedPalettes } from './getters';
import palette from 'utils/palette';
import sample from 'lodash/sample';
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
  // const token = localStorage.getItem('JWT_TOKEN');
  const token = rootState.auth.token;
  const params = { token };
  const url = urlJoin(baseUrl, api.url.root(repositoryId), '/subscribe');
  if (feed.isConnected) return;
  feed
    .connect(url, { params })
    .subscribe(Events.Add, ({ user, context }) => {
      const usedPalettes = getUsedPalettes(state);
      assignPalette(user, usedPalettes);
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

const fetch = ({ state, commit }, repositoryId) => {
  return api.fetch(repositoryId)
    .then(({ activeUsers }) => {
      forEach(activeUsers, user => {
        const usedPalettes = getUsedPalettes(state);
        assignPalette(user, usedPalettes, activeUsers);
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

function assignPalette(user, usedPalettes) {
  const availablePalette = find(palette, p => !usedPalettes.includes(p.id));
  const colorPalette = availablePalette || sample(palette);
  user.palette = colorPalette;
}
