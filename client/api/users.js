import request from './request';

const url = {
  user: userKey => `/users/${userKey}`
};

function patch(userKey, data) {
  return request
    .patch(url.user(userKey), data)
    .then(res => res.data.data);
};

export default {
  patch
};
