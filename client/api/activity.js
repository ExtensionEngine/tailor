import request from './request';

function getActivities(courseId, params) {
  return request.get(`/courses/${courseId}/activities`, { params })
    .then(res => res.data.data);
}

function createPreview(courseId, activityId) {
  return request.get(`courses/${courseId}/activities/${activityId}/preview`)
    .then(res => res.data.location);
}

export default {
  createPreview,
  getActivities
};
