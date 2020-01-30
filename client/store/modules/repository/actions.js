import api from '@/api/repository';
import filter from 'lodash/filter';

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
