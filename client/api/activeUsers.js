import request from './request';

const url = {
  root: courseId => `/courses/${courseId}/active-users`
};

function fetch(courseId) {
  return request.get(url.root(courseId)).then(res => res.data.data);
}

function add(context) {
  const { courseId } = context;
  return request.post(url.root(courseId), { context });
}

function remove(context) {
  const { courseId } = context;
  return request.delete(url.root(courseId), { data: { context } });
}

export default {
  url,
  fetch,
  add,
  remove
};
