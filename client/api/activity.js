import request from './request';

function getActivities(repositoryId, params) {
  return request.get(`/repositories/${repositoryId}/activities`, { params })
    .then(res => res.data.data);
}

function createPreview(repositoryId, activityId) {
  return request.get(`repositories/${repositoryId}/activities/${activityId}/preview`)
    .then(res => res.data.location);
}

export default {
  createPreview,
  getActivities
};
