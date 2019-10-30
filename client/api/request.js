import axios from 'axios';
import { EventEmitter } from 'events';
import HttpStatus from 'http-status';

const authScheme = process.env.AUTH_JWT_SCHEME;
const config = {
  baseURL: process.env.API_PATH,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
};

class Auth extends EventEmitter {
  constructor(storage = localStorage) {
    super();
    this.storage = storage;
    this.storageKey = 'JWT_TOKEN';
  }

  get token() {
    return this.storage.getItem(this.storageKey);
  }

  set token(val) {
    if (!val) {
      this.storage.removeItem(this.storageKey);
      return this.emit('token:remove');
    }
    this.storage.setItem(this.storageKey, val);
    this.emit('token:set', val);
  }
}

// Instance of axios to be used for all API requests.
const client = axios.create(config);
client.auth = new Auth();

// Attach additional instance without interceptors
Object.defineProperty(client, 'base', {
  get() {
    if (!this.base_) this.base_ = axios.create(config);
    return this.base_;
  }
});

client.interceptors.request.use(config => {
  const { token } = client.auth;
  if (token) {
    config.headers.Authorization = [authScheme, token].join(' ');
    return config;
  }
  delete config.headers.Authorization;
  return config;
});

client.interceptors.response.use(res => res, err => {
  const { FORBIDDEN, UNAUTHORIZED } = HttpStatus;
  if (err.response && [FORBIDDEN, UNAUTHORIZED].includes(err.response.status)) {
    return client.auth.emit('error', err);
  }
  throw err;
});

export default client;
