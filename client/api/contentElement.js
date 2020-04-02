import { extractData } from './helpers';
import request from './request';

const urls = {
  repository: id => `/repositories/${id}`,
  root: repositoryId => `${urls.repository(repositoryId)}/content-elements`,
  resource: (repositoryId, id) => `${urls.root(repositoryId)}/${id}`
};

function fetch({ repositoryId, ...params }) {
  return request.get(urls.root(repositoryId), { params }).then(extractData);
}

function patch({ repositoryId, id }, data) {
  return request.patch(urls.resource(repositoryId, id), data);
}

export default {
  fetch,
  patch
};
