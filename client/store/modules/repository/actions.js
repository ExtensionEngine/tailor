import api from '@/api/repository';
import each from 'lodash/each';
import feed from './feed';
import filter from 'lodash/filter';
import Promise from 'bluebird';

export const initialize = async (store, id) => {
  const { dispatch } = store;
  await dispatch('reset', id);
  initializeSSE(id, store);
  // Initialize repository state
  return Promise.all([
    dispatch('repositories/get', id, { root: true }),
    dispatch('activities/reset'),
    dispatch('getUsers'),
    dispatch('userTracking/fetch', id)]);
};

function initializeSSE(id, store) {
  const { dispatch, commit } = store;
  feed.connect(id, conn => commit('setSseId', conn.id));
  const modules = [
    'activities', 'contentElements', 'comments', 'userTracking'];
  each(modules, module => dispatch(`${module}/plugSSE`));
}

export const reset = ({ commit, dispatch }, id) => {
  if (feed.connected) feed.disconnect();
  const getRoute = entity => `repositories/${id}/${entity}`;
  const modules = {
    activities: 'activities',
    contentElements: 'content-elements',
    revisions: 'revisions',
    comments: 'comments'
  };
  commit('setSseId', null);
  commit('setRepositoryId', id);
  commit('userTracking/reset');
  each(modules, (_path, module) => commit(`${module}/reset`));
  if (!id) return;
  each(modules, (path, module) => dispatch(`${module}/setEndpoint`, getRoute(path)));
};

export const expandParents = ({ getters, commit }, activity) => {
  const parents = getters['activities/getAncestors'](activity);
  commit('expandParents', parents);
};

export const toggleActivities = ({ getters, commit }) => {
  const outline = filter(getters.outlineActivities, it => !it.deletedAt);
  commit('toggleActivities', outline);
};

export const getUsers = ({ rootState, commit }) => {
  const { route: { params: { repositoryId } } } = rootState;
  return api.getUsers(repositoryId)
    .then(users => commit('setUsers', users));
};

export const upsertUser = ({ commit }, { repositoryId, email, role }) => {
  return api.upsertUser(repositoryId, { email, role })
    .then(user => commit('upsertUser', user));
};

export const removeUser = ({ commit }, { repositoryId, userId }) => {
  return api.removeUser(repositoryId, userId)
    .then(() => commit('removeUser', userId));
};
