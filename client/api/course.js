import request from './request';

const url = {
  users: (courseId, userId = '') => `/courses/${courseId}/users/${userId}`
};

function getUsers(courseId, params) {
  return request
    .get(url.users(courseId), { params })
    .then(res => res.data.data);
};

function upsertUser(courseId, data) {
  return request
    .post(url.users(courseId), data)
    .then(res => res.data.data.user);
}

function removeUser(courseId, userId) {
  return request
    .delete(url.users(courseId, userId))
    .then(res => res.data);
}

export default {
  getUsers,
  upsertUser,
  removeUser
};
