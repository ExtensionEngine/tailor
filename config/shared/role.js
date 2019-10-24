'use strict';

const values = require('lodash/values');

const role = {
  user: { USER: 'USER', ADMIN: 'ADMIN', INTEGRATION: 'INTEGRATION' },
  course: { ADMIN: 'COURSE_ADMIN', AUTHOR: 'COURSE_AUTHOR' }
};

const userRoleRegex = new RegExp(`^(${values(role.user).join('|')})$`);
const courseRoleRegex = new RegExp(`^(${values(role.course).join('|')})$`);

module.exports = {
  ...role,
  userRoleRegex,
  courseRoleRegex,
  getRoleValues: type => values(role[type] || {})
};
