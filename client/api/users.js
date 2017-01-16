import request from './request';

const url = {
  userRole: userKey => `/users/${userKey}`,
  usersForCourse: courseKey => `/courses/${courseKey}/users`
};

function changeUserRole(userKey, role) {
  return request
    .put(url.userRole(userKey), { role })
    .then(res => res.data.data);
};

function fetchUsersForCourse(courseKey) {
  return request
    .get(url.usersForCourse(courseKey))
    .then(res => res.data.data);
};

export default {
  changeUserRole,
  fetchUsersForCourse
};
