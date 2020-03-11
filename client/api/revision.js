import { extractData } from './helpers';
import request from './request';

const urls = {
  root: repositoryId => `/repositories/${repositoryId}/revisions`,
  resource: (repositoryId, id) => `${urls.root(repositoryId)}/${id}`
};

function fetch(repositoryId, params) {
  return request.get(urls.root(repositoryId), { params }).then(extractData);
}

function get(repositoryId, id, params) {
  return request.get(urls.resource(repositoryId, id), { params })
    .then(res => res.data);
}

export default {
  fetch,
  get
};
