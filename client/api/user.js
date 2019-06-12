import request from './request';

const extractData = res => res.data.data;

function fetch(params) {
  return request.get('/users', { params }).then(extractData);
}

function upsert(data) {
  return request.post('/users', data).then(extractData);
}

function remove({ id }) {
  return request.delete(`/users/${id}`);
}

export default {
  fetch,
  upsert,
  remove
};
