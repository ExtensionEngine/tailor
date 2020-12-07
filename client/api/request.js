import axios, { Axios } from 'axios';
import { FORBIDDEN, UNAUTHORIZED } from 'http-status-codes';
import buildFullPath from 'axios/lib/core/buildFullPath';

Axios.prototype.submitForm = function (url, fields, options) {
  const action = buildFullPath(this.defaults.baseURL, url);
  return Promise.resolve(submitForm(action, fields, options));
};

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

function submitForm(action, fields = {}, options) {
  const form = document.createElement('form');
  Object.assign(form, { method: 'POST', target: 'blank', action }, options);
  Object.entries(fields).forEach(([name, attrs]) => {
    const input = document.createElement('input');
    Object.assign(input, { name }, attrs);
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
  form.remove();
}
