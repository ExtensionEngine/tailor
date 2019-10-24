import api from '@/api/course';
import filter from 'lodash/filter';

export const toggleActivities = ({ getters, commit }) => {
  const outline = filter(getters.outlineActivities, it => !it.deletedAt);
  commit('toggleActivities', outline);
};

export const getUsers = ({ rootState, commit }) => {
  const { route: { params: { courseId } } } = rootState;
  return api.getUsers(courseId)
    .then(users => commit('setUsers', users));
};

export const upsertUser = ({ commit }, { courseId, email, role }) => {
  return api.upsertUser(courseId, { email, role })
    .then(user => commit('upsertUser', user));
};

export const removeUser = ({ commit }, { courseId, userId }) => {
  return api.removeUser(courseId, userId)
    .then(() => commit('removeUser', userId));
};
