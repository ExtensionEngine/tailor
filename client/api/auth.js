import request from './request';

const url = {
  login: '/users/login',
  forgotPassword: '/users/forgot-password',
  resetPassword: '/users/reset-password',
  profile: '/users/me',
  changePassword: '/users/me/change-password'
};

function login(credentials) {
  return request
    .post(url.login, credentials)
    .then(res => res.data.data);
}

function logout() {
  // TODO(underscope): Add server side invalidation
  return Promise.resolve(true);
}

function forgotPassword(email) {
  return request.post(url.forgotPassword, { email });
}

function resetPassword(token, password) {
  return request.post(url.resetPassword, { token, password });
}

function changePassword(currentPassword, newPassword) {
  return request.post(url.changePassword, { currentPassword, newPassword });
}

function updateUserInfo(userData) {
  return request.patch(url.profile, userData);
}

export default {
  login,
  logout,
  forgotPassword,
  resetPassword,
  updateUserInfo,
  changePassword
};
