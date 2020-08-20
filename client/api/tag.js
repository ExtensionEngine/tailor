import { extractData } from './helpers';
import request from './request';

const urls = {
  root: '/tags'
};

function fetch(params) {
  return request.get(urls.root, { params }).then(extractData);
}

export default {
  fetch
};
