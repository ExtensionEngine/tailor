import request from './request';

const urls = {
  base: 'assets',
  repository: repositoryId => `repositories/${repositoryId}/assets`
};

function getUrl(key) {
  const params = { key };
  return request.get(urls.base, { params }).then(res => res.data.url);
}

function upload(data) {
  return request.post(urls.base, data).then(res => res.data);
}

function getRepositoryAssetUrl(repositoryId, key) {
  const params = { key };
  return request.get(urls.repository(repositoryId), { params })
    .then(res => res.data.url);
}

function uploadRepositoryAsset(repositoryId, data) {
  return request.post(urls.repository(repositoryId), data)
    .then(res => res.data);
}

export default {
  getUrl,
  upload,
  getRepositoryAssetUrl,
  uploadRepositoryAsset
};
