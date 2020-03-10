import { extractData } from './helpers';
import request from './request';

const urls = {
  root: repoId => `/repositories/${repoId}/revisions`,
  resource: (repoId, id) => `${urls.root(repoId)}/${id}`
};

function fetch(repoId, params) {
  return request.get(urls.root(repoId), { params }).then(extractData);
}

function fetchOne(repoId, id, params) {
  return request.get(urls.resource(repoId, id), { params })
    .then(res => res.data);
}

export default {
  fetch,
  fetchOne
};
