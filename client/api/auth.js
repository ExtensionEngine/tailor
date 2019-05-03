import request from './request';

const url = {
  login: '/users/login',
  forgotPassword: '/users/forgot-password',
  resetPassword: '/users/reset-password',
  updateProfile: '/users/me',
  changePassword: '/users/me/change-password',
  uploadAvatar: '/users/me/upload-avatar'
};

function login(credentials) {
  return request
    .post(url.login, credentials)
    .then(res => res.data.data)
    .then(({ token, user }) => {
      window.localStorage.setItem('JWT_TOKEN', token);
      return user;
    });
}

function logout() {
  window.localStorage.removeItem('JWT_TOKEN');
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

function uploadAvatar(data) {
  return request.post(url.uploadAvatar, data);
}

function updateUserInfo(userData) {
  return request.patch(url.updateProfile, { userData });
}

export default {
  login,
  logout,
  forgotPassword,
  resetPassword,
  updateUserInfo,
  changePassword,
  uploadAvatar
};
