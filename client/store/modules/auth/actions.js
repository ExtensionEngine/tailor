import { auth as api } from '@tailor/api';

export const login = ({ commit }, credentials) => {
  return api.login(credentials)
    .then(({ data: { user, authData } }) => commit('setAuth', { user, authData }));
};

export const logout = ({ commit }) => {
  return api.logout()
    .then(() => commit('resetAuth'));
};

export const changePassword = (_, { currentPassword, newPassword }) => {
  return api.changePassword(currentPassword, newPassword);
};

export const fetchUserInfo = ({ commit }) => {
  return api.getUserInfo()
    .then(({ data: { user, authData } }) => commit('setAuth', { user, authData }))
    .catch(() => commit('resetAuth'));
};

export const updateInfo = ({ commit }, userData) => {
  return api.updateUserInfo(userData)
    .then(({ data: { user } }) => commit('setUser', user));
};
