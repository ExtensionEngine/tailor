import axios from 'axios';
import enhanceError from 'axios/lib/core/enhanceError';

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

client.interceptors.response.use(res => reassignData(res), err => {
  if (err.response.status === 401) {
    window.localStorage.removeItem('JWT_TOKEN');
    window.localStorage.removeItem('TAILOR_USER');
    window.location.reload();
  } else {
    throw err;
  }
});

function reassignData(resp) {
  const { data, ...jsend } = resp.data;
  Object.assign(resp, { data, jsend });
  if (jsend.status !== 'error' && jsend.status !== 'fail') return resp;
  throw new JSendError(`Request failed with jsend status: ${jsend.status}`, resp);
}

// NOTE: added `JSendError` handler for later `jsend` implementation
class JSendError extends Error {
  constructor(message, response) {
    super(message);
    const { config, request, jsend } = response;
    const { toJSON, ...info } = enhanceError({}, config, null, request, response);
    Object.assign(this, info, {
      jsend,
      toJSON() {
        const json = toJSON.call(this);
        return Object.assign(json, { jsend });
      }
    });
  }

  get name() {
    return this.constructor.name;
  }

  get isJSendError() {
    return true;
  }
}

export default client;
