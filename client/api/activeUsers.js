import request from './request';

function fetch(id) {
  return request.get(`/courses/${id}/get-active-users`).then(res => res.data.data);
}

function add(context) {
  const { courseId } = context;
  return request.post(`/courses/${courseId}/add-active-user`, { context });
}

function remove(context) {
  const { courseId } = context;
  return request.post(`/courses/${courseId}/remove-active-user`, { context });
}

export default {
  fetch,
  add,
  remove
};
