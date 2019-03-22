import request from './request';

function createPreview(courseId, activityId) {
  return request.get(`courses/${courseId}/activities/${activityId}/preview`)
    .then(res => res.data.location);
}

export default { createPreview };
