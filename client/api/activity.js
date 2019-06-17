import path from 'path';
import request from './request';

const urls = {
  base: courseId => path.join('/courses/', String(courseId), '/activities')
};

function getActivities(courseId, params) {
  return request.get(urls.base(courseId), { params })
    .then(res => res.data.data);
}

export default {
  getActivities
};
