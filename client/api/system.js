import request from './request';

function getUsers() {
  const options = { params: { roleType: 'user' } };
  return request.get('/users', options).then(({ data: { data } }) => data);
}

function upsertUser(email, data) {
  const body = { email, ...data };
  return request.post('/users', body).then(({ data: { data } }) => data);
}

function removeUser(id) {
  return request.delete(`/users/${id}`);
}

module.exports = {
  getUsers,
  upsertUser,
  removeUser
};
