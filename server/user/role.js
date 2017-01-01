const role = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

const roleNames = Object.keys(role).map(k => role[k]);
const validationRegex = new RegExp(`^(${roleNames.join('|')})$`);

module.exports = {
  ADMIN: role.ADMIN,
  USER: role.USER,
  default: role.USER,
  validationRegex
};
