import { extractData } from './helpers';
import request from './request';

const urls = {
  root: '/tags'
};

function fetch(associated) {
  const params = { associated: !!associated };
  return request.get(urls.root, { params }).then(extractData);
}

export default {
  fetch
};
