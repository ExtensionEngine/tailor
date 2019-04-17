import request from './request';

const url = {
  login: '/users/login',
  forgotPassword: '/users/forgotPassword',
  resetPassword: '/users/resetPassword',
  updateProfile: '/users/me',
  saveImageUrl: id => `/users/me/${id}/saveImageKey`,
  deleteImageUrl: id => `/users/me/${id}/deleteImageKey`,
  changePassword: id => `/users/me/${id}/changePassword`
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

function changePassword(id, password) {
  return request.post(url.changePassword(id), { password });
}

function saveImageUrl(id, key) {
  return request.post(url.saveImageUrl(id), { key });
}

function deleteImageUrl(id) {
  return request.post(url.deleteImageUrl(id));
}

function updateUserInfo(user) {
  return request.patch(url.updateProfile, { user });
}

export default {
  login,
  logout,
  forgotPassword,
  resetPassword,
  updateUserInfo,
  changePassword,
  saveImageUrl,
  deleteImageUrl
};
