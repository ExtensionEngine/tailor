import request from './request';

const url = {
  root: repositoryId => `/repositories/${repositoryId}/active-users`
};

function fetch(repositoryId) {
  return request.get(url.root(repositoryId)).then(res => res.data.data);
}

function add(context) {
  const { repositoryId } = context;
  return request.post(url.root(repositoryId), { context });
}

function remove(context) {
  const { repositoryId } = context;
  return request.delete(url.root(repositoryId), { data: { context } });
}

export default {
  url,
  fetch,
  add,
  remove
};
