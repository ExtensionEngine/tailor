import values from 'lodash/values.js';

const role = {
  user: { USER: 'USER', ADMIN: 'ADMIN' },
  repository: { ADMIN: 'ADMIN', AUTHOR: 'AUTHOR' }
};

export default {
  ...role,
  getRoleValues: type => values(role[type] || {})
};
