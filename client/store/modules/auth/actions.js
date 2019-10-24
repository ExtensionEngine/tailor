import api from '@/api/auth';

export const login = ({ commit }, credentials) => {
  return api.login(credentials)
    .then(data => commit('login', data));
};

export const logout = ({ commit }) => {
  return api
    .logout()
    .then(() => setTimeout(() => {
      commit('logout');
      window.location.reload();
    }, 0));
};

export const forgotPassword = (_, { email }) => api.forgotPassword(email);

export const resetPassword = (_, { token, password }) => {
  return api.resetPassword(token, password);
};
