import authApi from '../../../api/auth';

export const login = ({ commit }, credentials) => {
  return authApi.login(credentials)
    .then(user => commit('login', user));
};

export const logout = () => {
  return authApi
    .logout()
    .then(() => setTimeout(() => {
      window.localStorage.removeItem('TAILOR_USER');
      window.location.reload();
    }, 0));
};

export const forgotPassword = (context, { email }) => {
  return authApi.forgotPassword(email);
};

export const resetPassword = (context, { token, password }) => {
  return authApi.resetPassword(token, password);
};
