import request from './request';

const url = {
  usersForCourse: courseKey => `/courses/${courseKey}/users`
};

function fetchUsersForCourse(courseKey) {
  return request
    .get(url.usersForCourse(courseKey))
    .then(res => res.data.data);
};

export default {
  fetchUsersForCourse
};
