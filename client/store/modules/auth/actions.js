import api from '@/api/auth';

export const login = ({ commit }, credentials) => {
  return api.login(credentials)
    .then(({ user }) => commit('setUser', user));
};

export const logout = ({ commit }) => {
  return api.logout()
    .then(() => window.location.reload());
};

export const changePassword = (_, { currentPassword, newPassword }) => {
  return api.changePassword(currentPassword, newPassword);
};

export const forgotPassword = (_, { email }) => api.forgotPassword(email);

export const resetPassword = (_, { token, password }) => {
  return api.resetPassword(token, password);
};

export const fetchUserInfo = ({ commit }) => {
  return api.getUserInfo()
    .then(({ data: { user } }) => commit('setUser', user))
    .catch(() => commit('setUser', null))
    .finally(() => commit('resolveLoading'));
};

export const updateInfo = ({ commit }, userData) => {
  return api.updateUserInfo(userData)
    .then(({ data: { user } }) => commit('setUser', user));
};
