import request from './request';

function getActivities(courseId, params) {
  return request.get(`/courses/${courseId}/activities`, { params })
    .then(res => res.data.data);
}

export default {
  getActivities
};
