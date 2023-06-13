import request from './request';

const urls = {
  root: '/users',
  login: () => `${urls.root}/login`,
  logout: () => `${urls.root}/logout`,
  forgotPassword: () => `${urls.root}/forgot-password`,
  resetPassword: () => `${urls.root}/reset-password`,
  resetTokenStatus: () => `${urls.resetPassword()}/token-status`,
  profile: () => `${urls.root}/me`,
  changePassword: () => `${urls.profile()}/change-password`
};

function login(credentials) {
  return request.base.post(urls.login(), credentials);
}

function logout() {
  return request.get(urls.logout());
}

function forgotPassword(email) {
  return request.post(urls.forgotPassword(), { email });
}

function resetPassword(token, password) {
  return request.base.post(urls.resetPassword(), { token, password });
}

function validateResetToken(token) {
  return request.base.post(urls.resetTokenStatus(), { token });
}

function changePassword(currentPassword, newPassword) {
  return request.post(urls.changePassword(), { currentPassword, newPassword });
}

function getUserInfo() {
  return request.base.get(urls.profile());
}

function updateUserInfo(userData) {
  return request.patch(urls.profile(), userData);
}

export default {
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserInfo,
  updateUserInfo,
  changePassword,
  validateResetToken
};
