import request from './request';

function fetch(id) {
  return request.get(`/courses/${id}/active-users`).then(res => res.data.data);
}

function add(context) {
  const { courseId } = context;
  return request.post(`/courses/${courseId}/active-users`, { context });
}

function remove(context) {
  const { courseId } = context;
  return request.post(`/courses/${courseId}/active-users/remove`, { context });
}

export default {
  fetch,
  add,
  remove
};
