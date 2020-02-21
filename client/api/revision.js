import request from './request';

const urls = {
  root: repositoryId => `/repositories/${repositoryId}/revisions`
};

function fetch(repositoryId, params) {
  return request.get(urls.root(repositoryId), { params })
    .then(res => res.data.data);
}

export default {
  fetch
};
