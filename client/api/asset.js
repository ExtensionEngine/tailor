import request from './request';

const urls = {
  base: 'assets'
};

function getUrl(folder, key) {
  const params = { key: `${folder}/${key}` };
  return request.get(urls.base, { params }).then(res => res.data.url);
}

function upload(folder, data) {
  if (folder) data.append('folder', folder);
  return request.post(urls.base, data).then(res => res.data);
}

export default {
  getUrl,
  upload
};
