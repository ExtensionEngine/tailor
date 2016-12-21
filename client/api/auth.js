import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1/';

const request = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
