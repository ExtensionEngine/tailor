import { extractData } from './helpers';
import request from './request';

const urls = {
  root: '/repositories',
  resource: id => `${urls.root}/${id}`,
  contentInventory: id => `${urls.resource(id)}/content-inventory`,
  publish: id => `${urls.resource(id)}/publish`,
  users: (id, userId = '') => `${urls.resource(id)}/users/${userId}`
};

function save(repository) {
  return request.post(urls.root, repository).then(extractData);
}

function getRepositories(params) {
  return request.get(urls.root, { params }).then(extractData);
}

function getUsers(repositoryId, params) {
  return request
    .get(urls.users(repositoryId), { params })
    .then(extractData);
}

function upsertUser(repositoryId, data) {
  return request
    .post(urls.users(repositoryId), data)
    .then(res => extractData(res).user);
}

function removeUser(repositoryId, userId) {
  return request
    .delete(urls.users(repositoryId, userId))
    .then(res => res.data);
}

function publishRepositoryMeta(id) {
  return request.post(urls.publish(id)).then(res => res.data);
}

export default {
  getRepositories,
  save,
  getUsers,
  upsertUser,
  removeUser,
  publishRepositoryMeta
};
