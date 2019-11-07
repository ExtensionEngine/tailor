import request from './request';

const urls = {
  root: '/repositories',
  resource: id => `${urls.root}/${id}`,
  contentInventory: id => `${urls.resource(id)}/content-inventory`,
  publish: id => `${urls.resource(id)}/publish`,
  users: (id, userId = '') => `${urls.resource(id)}/users/${userId}`
};

function getRepositories(params) {
  return request.get(urls.root, { params }).then(res => res.data.data);
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

function publishRepositoryMeta(id) {
  return request.post(urls.publish(id)).then(res => res.data);
}

export default {
  getRepositories,
  getUsers,
  upsertUser,
  removeUser,
  publishRepositoryMeta
};
