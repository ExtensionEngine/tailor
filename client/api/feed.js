import { extractData } from './helpers';
import request from './request';

const urls = {
  root: repositoryId => `/repositories/${repositoryId}/feed`,
  subscribe: repositoryId => `${urls.root(repositoryId)}/subscribe`
};

function fetch(repositoryId) {
  return request.get(urls.root(repositoryId)).then(extractData);
}

function start(context) {
  return request.post(urls.root(context.repositoryId), { context });
}

function end(context) {
  return request.delete(urls.root(context.repositoryId), { data: { context } });
}

export default {
  urls,
  fetch,
  start,
  end
};
