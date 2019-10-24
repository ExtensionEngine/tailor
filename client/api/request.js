import axios from 'axios';

const config = {
  baseURL: process.env.API_PATH,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
};

// Instance of axios to be used for all API requests.
const client = axios.create(config);

Object.defineProperty(client, 'base', {
  get() {
    if (!this.base_) this.base_ = axios.create(config);
    return this.base_;
  }
});

client.interceptors.request.use(config => {
  const token = window.localStorage.getItem('JWT_TOKEN');
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  } else if (!token && config.headers.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});

client.interceptors.response.use(res => res, err => {
  if (err.response && err.response.status === 401) {
    window.localStorage.removeItem('JWT_TOKEN');
    window.localStorage.removeItem('TAILOR_USER');
    window.location.reload();
  } else {
    throw err;
  }
});

export default client;
