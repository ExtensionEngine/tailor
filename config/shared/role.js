'use strict';

const values = require('lodash/values');

const role = {
  user: { USER: 'USER', ADMIN: 'ADMIN', INTEGRATION: 'INTEGRATION' },
  repository: { ADMIN: 'Repository_ADMIN', AUTHOR: 'Repository_AUTHOR' }
};

const userRoleRegex = new RegExp(`^(${values(role.user).join('|')})$`);
const repositoryRoleRegex = new RegExp(`^(${values(role.repository).join('|')})$`);

module.exports = {
  ...role,
  userRoleRegex,
  repositoryRoleRegex,
  getRoleValues: type => values(role[type] || {})
};
