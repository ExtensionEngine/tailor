import values from 'lodash/values.js';

const role = {
  user: { USER: 'USER', ADMIN: 'ADMIN' },
  repository: { ADMIN: 'ADMIN', AUTHOR: 'AUTHOR' }
}

export const user = role.user;

export const repository = role.repository;

export const getRoleValues = type => values(role[type] || {});

export default role;
