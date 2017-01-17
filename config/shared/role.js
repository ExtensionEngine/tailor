const role = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  ADMIN: 'ADMIN',
  CONTENT_AUTHOR: 'CONTENT_AUTHOR'
};

const roleNames = Object.keys(role).map(k => role[k]);
const validationRegex = new RegExp(`^(${roleNames.join('|')})$`);

module.exports = {
  SYSTEM_ADMIN: role.SYSTEM_ADMIN,
  ADMIN: role.ADMIN,
  CONTENT_AUTHOR: role.CONTENT_AUTHOR,
  default: role.CONTENT_AUTHOR,
  validationRegex
};
