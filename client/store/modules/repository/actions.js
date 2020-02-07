import api from '@/api/repository';
import each from 'lodash/each';
import filter from 'lodash/filter';
import Promise from 'bluebird';

export const initialize = ({ dispatch }, id) => {
  const getRoute = entity => `repositories/${id}/${entity}`;
  const modules = {
    activities: 'activities',
    tes: 'content-elements',
    revisions: 'revisions',
    comments: 'comments'
  };
  each(modules, (path, module) => dispatch(`${module}/setEndpoint`, getRoute(path)));
  return Promise.all([
    dispatch('repositories/get', id, { root: true }),
    dispatch('activities/reset'),
    dispatch('getUsers')]);
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
