import request from './request';

const url = {
  login: '/users/login',
  forgotPassword: '/users/forgotPassword',
  resetPassword: '/users/resetPassword'
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

function commentCheckTime({ userId, checkTime }) {
  return request.post('/users/commentsCheckTime', { userId, checkTime })
    .then(res => res.data);
}

function emailComments({ courseId, email, since }) {
  return request.post(`/courses/${courseId}/comments/email`, { email, since });
}

export default {
  login,
  logout,
  forgotPassword,
  resetPassword,
  commentCheckTime,
  emailComments
};
