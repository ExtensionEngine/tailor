import path from 'path';
import request from './request';

const urls = {
  base: courseId => path.join('/courses/', String(courseId), '/revisions'),
  restore: (courseId, id) => path.join(urls.base(courseId), String(id), '/restore')
};

function restore({ id, courseId }, data) {
  return request.post(urls.restore(courseId, id), data)
    .then(res => res.data.data);
}

export default {
  restore
};
