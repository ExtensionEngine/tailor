import axios from 'axios';
import urljoin from 'url-join';

const BASE_URL = 'http://localhost:8081/';
const loginUrl = urljoin(BASE_URL, 'login');
const passwordResetUrl = urljoin(BASE_URL, 'reset-password');

// TODO: place in a separate config file
const headerConfig = {
  headers: {
    'Content-Type': 'application/json'
  }
};

// TODO: create one instance of axios with predefined headers?
export default {
  loginUser(email, password) {
    const data = { email, password };
    return axios.post(loginUrl, data, headerConfig);
  },

  resetPassword(email) {
    const data = { email };
    return axios.post(passwordResetUrl, data, headerConfig);
  }
};
