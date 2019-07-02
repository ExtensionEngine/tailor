import axios from 'axios';
import HttpStatus from 'http-status-codes';

const config = {
  baseURL: process.env.API_PATH,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
};

// Instance of axios to be used for all API requests.
const client = axios.create(config);

client.interceptors.request.use(config => {
  const token = localStorage.getItem('JWT_TOKEN');
  if (token) {
    config.headers['Authorization'] = `JWT ${token}`;
    return config;
  }
  delete config.headers['Authorization'];
  return config;
});

client.interceptors.response.use(res => res, err => {
  if (err.response && err.response.status === HttpStatus.FORBIDDEN) {
    localStorage.removeItem('TAILOR_USER');
    localStorage.removeItem('JWT_TOKEN');
    location.reload();
  }
  throw err;
});

export default client;
