import request from './request';

const extractData = res => res.data.data;

function getUsers() {
  const options = { params: { roleType: 'user' } };
  return request.get('/users', options).then(extractData);
}

function upsertUser(email, data) {
  const body = { email, ...data };
  return request.post('/users', body).then(extractData);
}

function removeUser(id) {
  return request.delete(`/users/${id}`);
}

export default {
  getUsers,
  upsertUser,
  removeUser
};
