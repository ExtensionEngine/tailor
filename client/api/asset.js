import request from './request';

const urls = {
  base: '/assets',
  uploadScorm: () => `${urls.base}/scorm`
};

function getUrl(key) {
  const params = { key };
  return request.get(urls.base, { params }).then(res => res.data.url);
}

function upload(data) {
  return request.post(urls.base, data).then(res => res.data);
}

function uploadScormPackage(data) {
  return request.post(urls.uploadScorm(), data).then(res => res.data);
}

export default {
  getUrl,
  upload,
  uploadScormPackage
};
