import axios from 'axios';

// TODO: read this from configuration.
const BASE_URL = '/api/v1/';

// Instance of axios to be used for all API requests.
const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

client.setStorageInterface = function ({ getToken, clearAuthData }) {
  this._getAuthToken = getToken;
  this._clearAuthData = clearAuthData;
};

client.interceptors.request.use(config => {
  const token = client._getAuthToken();
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  } else if (!token && config.headers.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});

client.interceptors.response.use(res => res, err => {
  if (err.response.status === 401) {
    // If server responded that request was unauthorized.
    client._clearAuthData();
  } else {
    throw err;
  }
});

export default client;
