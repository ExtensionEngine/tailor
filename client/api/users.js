import request from './request';

const url = {
  userInvite: '/users/invite',
  courseAccess: (userKey, courseKey) => `/users/${userKey}/access/courses/${courseKey}`,
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

function inviteUserToCourse(data) {
  return request
    .post(url.userInvite, data)
    .then(res => res.data.data);
}

function revokeAccessToCourse(userKey, courseKey) {
  return request
    .delete(url.courseAccess(userKey, courseKey), { userKey, courseKey })
    .then(res => res.data.data);
}

export default {
  changeUserRole,
  fetchUsersForCourse,
  inviteUserToCourse,
  revokeAccessToCourse
};
