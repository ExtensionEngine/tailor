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

function deleteRepositoryTag({ repositoryId, tagId }) {
  return request.delete(urls.repositoryTag(repositoryId, tagId))
    .then(extractData);
}

export default {
  list,
  createRepositoryTag,
  deleteRepositoryTag
};
