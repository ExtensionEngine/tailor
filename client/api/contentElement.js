import request from './request';

const urls = {
  root: repositoryId => `/repositories/${repositoryId}/content-elements`,
  resource: (repositoryId, id) => `${urls.root(repositoryId)}/${id}`
};

function patch({ repositoryId, id }, data) {
  return request.patch(urls.resource(repositoryId, id), data);
}

export default {
  patch
};
