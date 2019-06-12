import request from './request';

function getActiveUsers(id) {
  return request.post(`/courses/${id}/get-active-users`).then(res => res.data.data);
}

function addActiveUser(context) {
  const { courseId } = context;
  return request.post(`/courses/${courseId}/add-active-user`, { context });
}

function removeActiveUser(context) {
  const { courseId } = context;
  return request.post(`/courses/${courseId}/remove-active-user`, { context });
}

export default {
  getActiveUsers,
  addActiveUser,
  removeActiveUser
};
