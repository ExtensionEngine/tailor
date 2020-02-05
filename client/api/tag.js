import { extractData } from './helpers';
import request from './request';

const urls = {
  root: '/tags',
  repositoryTags: repoId => `/repositories/${repoId}/tags`,
  repositoryTag: (repoId, tagId) => `/repositories/${repoId}/tags/${tagId}`
};

function list() {
  return request.get(urls.root).then(extractData);
}

function createRepositoryTag(data) {
  return request.post(urls.repositoryTags(data.repositoryId), data)
    .then(extractData);
}

function deleteRepositoryTag(data) {
  return request.delete(urls.repositoryTag(data.repositoryId, data.id));
}

export default {
  list,
  createRepositoryTag,
  deleteRepositoryTag
};
