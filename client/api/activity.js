import path from 'path';
import request from './request';

const urls = {
  base: courseId => path.join('/courses/', String(courseId), '/activities')
};

function getActivities(courseId, params) {
  return request.get(urls.base(courseId), { params })
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
