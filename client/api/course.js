import request from './request';

const url = {
  users: courseKey => `/courses/${courseKey}/users`,
  user: (courseKey, userKey) => `/courses/${courseKey}/users/${userKey}`
};

function getUsers(courseKey, params) {
  return request
    .get(url.users(courseKey), { params })
    .then(res => res.data.data);
};

function invite(courseKey, data) {
  return request
    .post(url.users(courseKey), data)
    .then(res => res.data.data);
}

function revoke(courseKey, userKey) {
  return request
    .delete(url.user(courseKey, userKey))
    .then(res => res.data.data);
}

export default {
  getUsers,
  invite,
  revoke
};
