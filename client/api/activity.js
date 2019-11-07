import request from './request';

const urls = {
  root: repositoryId => `/repositories/${repositoryId}/activities`
};

function getActivities(repositoryId, params) {
  return request.get(urls.root(repositoryId), { params })
    .then(res => res.data.data);
}

function createPreview(repositoryId, activityId) {
  return request.get(`${urls.root(repositoryId)}/${activityId}/preview`)
    .then(res => res.data.location);
}

export default {
  createPreview,
  getActivities
};
