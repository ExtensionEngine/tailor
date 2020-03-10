import api from '@/api/repository';
import each from 'lodash/each';
import filter from 'lodash/filter';
import Promise from 'bluebird';

export const initialize = ({ commit, dispatch }, id) => {
  const getRoute = entity => `repositories/${id}/${entity}`;
  const modules = {
    activities: 'activities',
    tes: 'content-elements',
    revisions: 'revisions',
    comments: 'comments'
  };
  // Reset store and setup api endpoints
  each(modules, (path, module) => {
    commit(`${module}/reset`);
    dispatch(`${module}/setEndpoint`, getRoute(path));
  });
  dispatch('revisions/resetPagination');
  // Initialize repository state
  return Promise.all([
    dispatch('repositories/get', id, { root: true }),
    dispatch('activities/reset'),
    dispatch('getUsers')]);
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
