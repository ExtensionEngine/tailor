import values from 'lodash/values.js';

export const user = { USER: 'USER', ADMIN: 'ADMIN', INTEGRATION: 'INTEGRATION' };
export const repository = { ADMIN: 'ADMIN', AUTHOR: 'AUTHOR' };

export default {
  user,
  repository,
  getRoleValues: type => values(role[type] || {})
};
