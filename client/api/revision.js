import { extractData } from './helpers';
import request from './request';

const urls = {
  root: repositoryId => `/repositories/${repositoryId}/revisions`
};

function fetch(repositoryId, params) {
  return request.get(urls.root(repositoryId), { params }).then(extractData);
}

export default {
  fetch
};
