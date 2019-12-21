import request from './request';

const urls = {
  login: '/users/login',
  forgotPassword: '/users/forgot-password',
  resetPassword: '/users/reset-password',
  profile: '/users/me',
  changePassword: '/users/me/change-password'
};

function login(credentials) {
  return request.base
    .post(urls.login, credentials)
    .then(res => res.data.data);
}

function forgotPassword(email) {
  return request.post(urls.forgotPassword, { email });
}

function resetPassword(token, password) {
  return request.post(urls.resetPassword, { token, password });
}

function changePassword(currentPassword, newPassword) {
  return request.post(urls.changePassword, { currentPassword, newPassword });
}

function updateUserInfo(userData) {
  return request.patch(urls.profile, userData);
}

export default {
  login,
  forgotPassword,
  resetPassword,
  updateUserInfo,
  changePassword
};
