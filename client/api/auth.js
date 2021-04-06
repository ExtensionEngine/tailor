import path from 'path';
import request from './request';

const urls = {
  root: '/users',
  login: () => path.join(urls.root, 'login'),
  logout: () => path.join(urls.root, 'logout'),
  forgotPassword: () => path.join(urls.root, 'forgot-password'),
  resetPassword: () => path.join(urls.root, 'reset-password'),
  validateResetToken: () => path.join(urls.root, 'reset-token-validation'),
  profile: () => path.join(urls.root, 'me'),
  changePassword: () => path.join(urls.profile(), 'change-password')
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
  return request.base.post(urls.validateResetToken(), { token });
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
