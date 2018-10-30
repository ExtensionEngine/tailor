'use strict';

const isPlainObject = require('lodash/isPlainObject');
const values = require('lodash/values');

const userRoles = { USER: 'USER', ADMIN: 'ADMIN', INTEGRATION: 'INTEGRATION' };
const courseRoles = { ADMIN: 'COURSE_ADMIN', AUTHOR: 'COURSE_AUTHOR' };

const userRoleRegex = new RegExp(`^(${values(userRoles).join('|')})$`);
const courseRoleRegex = new RegExp(`^(${values(courseRoles).join('|')})$`);

module.exports = {
  user: userRoles,
  course: courseRoles,
  userRoleRegex,
  courseRoleRegex,
  getRoleNames(type) {
    const roles = this[type];
    return isPlainObject(roles) ? values(roles) : [];
  }
};
