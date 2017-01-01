import axios from 'axios';

// TODO: read this from configuration.
const BASE_URL = 'http://localhost:3000/api/v1/';

/**
 * Instance of axios to be used for all API requests.
 */
const request = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default request;
