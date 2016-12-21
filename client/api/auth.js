import request from './request';

const url = {
  login: '/users/actions/login',
  logout: '/users/actions/logout'
};

function login(credentials) {
  return request
    .post(url.login, credentials)
    .then(res => res.data.data);
}

function logout() {
  return request.post(url.logout);
}

export default {
  login,
  logout
};
