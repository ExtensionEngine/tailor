import get from 'lodash/get';
import request from './request';

const url = {
  root: () => '/asset'
};

function getUrl(key) {
  const params = { key };
  return request.get(url.root(), { params }).then(res => get(res, 'data.url'));
}

function upload(data) {
  return request
    .post(url.root(), data)
    .then(res => res.data);
}

export default {
  getUrl,
  upload
};
