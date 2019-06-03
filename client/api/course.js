import request from './request';

const url = {
  users: (courseId, userId = '') => `/courses/${courseId}/users/${userId}`
};

function getCourses(params) {
  return request.get('/courses', { params }).then(res => res.data.data);
}

function getUsers(courseId, params) {
  return request
    .get(url.users(courseId), { params })
    .then(res => res.data.data);
}

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

function getContentInventory(courseId) {
  return request({
    method: 'get',
    responseType: 'arraybuffer',
    url: `/courses/${courseId}/content-inventory`
  }).then(res => res.data);
}

function publishRepositoryMeta(id) {
  return request.post(`/courses/${id}/publish`).then(res => res.data);
}

export default {
  getCourses,
  getUsers,
  upsertUser,
  removeUser,
  getContentInventory,
  publishRepositoryMeta
};
