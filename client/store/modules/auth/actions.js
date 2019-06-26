import api from '@/api/auth';

export const login = ({ commit }, credentials) => {
  return api.login(credentials)
    .then(user => commit('login', user));
};

export const logout = () => {
  return api
    .logout()
    .then(() => setTimeout(() => {
      window.localStorage.removeItem('TAILOR_USER');
      window.location.reload();
    }, 0));
};

export const forgotPassword = (context, { email }) => api.forgotPassword(email);

export const resetPassword = (context, { token, password }) => {
  return api.resetPassword(token, password);
};
