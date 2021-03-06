import request from './request';

const urls = {
  base: repositoryId => `/repositories/${repositoryId}/assets`
};

function getUrl(repositoryId, key) {
  const params = { key };
  return request.get(urls.base(repositoryId), { params }).then(res => res.data.url);
}

function upload(repositoryId, data) {
  return request.post(urls.base(repositoryId), data).then(res => res.data);
}

export default {
  getUrl,
  upload
};
