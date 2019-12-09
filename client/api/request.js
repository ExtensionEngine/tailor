import { FORBIDDEN, UNAUTHORIZED } from 'http-status-codes';
import axios from 'axios';

const authScheme = process.env.AUTH_JWT_SCHEME;
const config = {
  baseURL: process.env.API_PATH,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
};

// Instance of axios to be used for all API requests.
const client = axios.create(config);

// Attach additional instance without interceptors
Object.defineProperty(client, 'base', {
  get() {
    if (!this.base_) this.base_ = axios.create(config);
    return this.base_;
  }
});

client.interceptors.request.use(config => {
  const { token } = client;
  if (token) {
    config.headers.Authorization = [authScheme, token].join(' ');
    return config;
  }
  delete config.headers.Authorization;
  return config;
});

client.interceptors.response.use(res => res, err => {
  if (err.response && [FORBIDDEN, UNAUTHORIZED].includes(err.response.status)) {
    client.token = null;
  }
  throw err;
});

export default client;
