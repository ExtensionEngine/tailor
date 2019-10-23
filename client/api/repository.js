import request from './request';

const url = {
  users: (repositoryId, userId = '') => `/repositories/${repositoryId}/users/${userId}`
};

function getRepositories(params) {
  return request.get('/repositories', { params }).then(res => res.data.data);
}

function getUsers(repositoryId, params) {
  return request
    .get(url.users(repositoryId), { params })
    .then(res => res.data.data);
}

function upsertUser(repositoryId, data) {
  return request
    .post(url.users(repositoryId), data)
    .then(res => res.data.data.user);
}

function removeUser(repositoryId, userId) {
  return request
    .delete(url.users(repositoryId, userId))
    .then(res => res.data);
}

function getContentInventory(repositoryId) {
  return request({
    method: 'get',
    responseType: 'arraybuffer',
    url: `/repositories/${repositoryId}/contentInventory`
  }).then(res => res.data);
}

function publishRepositoryMeta(id) {
  return request.post(`/repositories/${id}/publish`).then(res => res.data);
}

export default {
  getRepositories,
  getUsers,
  upsertUser,
  removeUser,
  getContentInventory,
  publishRepositoryMeta
};
