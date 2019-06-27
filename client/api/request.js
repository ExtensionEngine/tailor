import axios from 'axios';
import JSendInterceptor from 'jsend-axios';

// TODO: read this from configuration.
const BASE_URL = '/api/v1/';

// Instance of axios to be used for all API requests.
const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

client.interceptors.request.use(config => {
  const token = window.localStorage.getItem('JWT_TOKEN');
  if (token) {
    config.headers['Authorization'] = `JWT ${token}`;
  } else if (!token && config.headers['Authorization']) {
    delete config.headers['Authorization'];
  }
  return config;
});

JSendInterceptor(client);

client.interceptors.response.use(res => reassignData(res), err => {
  if (err.response.status === 401) {
    window.localStorage.removeItem('JWT_TOKEN');
    window.localStorage.removeItem('TAILOR_USER');
    window.location.reload();
  } else {
    throw err;
  }
});

function reassignData(response) {
  const { data } = response.data;
  if (response.jsend) return response;
  return Object.assign(response, { data });
}

export default client;
