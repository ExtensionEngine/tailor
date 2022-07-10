import values from 'lodash/values';

export const role = {
  user: { USER: 'USER', ADMIN: 'ADMIN' },
  repository: { ADMIN: 'ADMIN', AUTHOR: 'AUTHOR' }
};

export const getRoleValues = type => values(role[type] || {})
