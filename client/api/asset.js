import request from './request';

const urls = {
  base: '/assets'
};

function getUrl(key) {
  const params = { key };
  return request.get(urls.base, { params }).then(res => res.data.url);
}

function upload(data) {
  return request.post(urls.base, data).then(res => res.data);
}

export default {
  getUrl,
  upload
};
