import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1/';

const request = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  transformResponse: [
    data => JSON.parse(data).data
  ]
});

const url = {
  login: '/users/actions/login'
};

function login(credentials) {
  return request
    .post(url.login, credentials)
    .then(res => res.data);
}

export default {
  login
};
