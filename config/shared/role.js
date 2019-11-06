'use strict';

const values = require('lodash/values');

const role = {
  user: { USER: 'USER', ADMIN: 'ADMIN', INTEGRATION: 'INTEGRATION' },
  repository: { ADMIN: 'ADMIN', AUTHOR: 'AUTHOR' }
};

module.exports = {
  ...role,
  getRoleValues: type => values(role[type] || {})
};
