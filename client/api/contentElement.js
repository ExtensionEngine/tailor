import { extractData } from './helpers';
import request from './request';

const urls = {
  repository: id => `/repositories/${id}`,
  root: repositoryId => `${urls.repository(repositoryId)}/content-elements`
};

function fetch({ repositoryId, ...params }) {
  return request.get(urls.root(repositoryId), { params }).then(extractData);
}

export default {
  fetch
};
