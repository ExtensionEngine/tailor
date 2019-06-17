import path from 'path';
import request from './request';

const urls = {
  base: () => '/courses',
  contentInventory: courseId => path.join(urls.base(), String(courseId), '/content-inventory'),
  publish: courseId => path.join(urls.base(), String(courseId), '/publish'),
  users: (courseId, userId = '') => path.join(urls.base(), String(courseId), '/users', userId)
};

function getCourses(params) {
  return request.get(urls.base(), { params }).then(res => res.data.data);
}

function getUsers(courseId, params) {
  return request
    .get(urls.users(courseId), { params })
    .then(res => res.data.data);
}

function upsertUser(courseId, data) {
  return request
    .post(urls.users(courseId), data)
    .then(res => res.data.data.user);
}

function removeUser(courseId, userId) {
  return request
    .delete(urls.users(courseId, userId))
    .then(res => res.data);
}

function getContentInventory(courseId) {
  const url = urls.contentInventory(courseId);
  return request.get(url, { responseType: 'arraybuffer' }).then(res => res.data);
}

function publishRepositoryMeta(id) {
  return request.post(urls.publish(id)).then(res => res.data);
}

export default {
  getCourses,
  getUsers,
  upsertUser,
  removeUser,
  getContentInventory,
  publishRepositoryMeta
};
