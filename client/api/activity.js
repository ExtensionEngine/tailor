import request from './request';

const urls = {
  root: courseId => `/courses/${courseId}/activities`
};

function getActivities(courseId, params) {
  return request.get(urls.root(courseId), { params })
    .then(res => res.data.data);
}

function createPreview(courseId, activityId) {
  return request.get(`${urls.root(courseId)}/${activityId}/preview`)
    .then(res => res.data.location);
}

export default {
  createPreview,
  getActivities
};
