import request from './request';

const urls = {
  resource: (repoId, id) => `/repositories/${repoId}/content-elements/${id}`
};

function patch(repoId, id, data) {
  return request.patch(urls.resource(repoId, id), data);
}

export default {
  patch
};
