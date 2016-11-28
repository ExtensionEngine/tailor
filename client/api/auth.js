import axios from 'axios';

const AUTH_URL = 'http://localhost:8081/login/';

export default {
  loginUser(email, password) {
    const data = { id: 1, email, password };
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    return axios.post(AUTH_URL, data, config);
  }
};
