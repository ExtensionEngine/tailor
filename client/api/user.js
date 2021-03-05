import { extractData } from './helpers';
import request from './request';

function fetch(params) {
  return request.get('/users', { params }).then(extractData);
}

function upsert(data) {
  return request.post('/users', data).then(extractData);
}

function remove({ id }) {
  return request.delete(`/users/${id}`);
}

function reinvite({ id }) {
  return request.post(`/users/${id}/reinvite`);
}

export default {
  fetch,
  upsert,
  remove,
  reinvite
};
