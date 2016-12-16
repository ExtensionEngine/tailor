'use strict';

const INSERT_USER = `
INSERT @user IN @@collection
RETURN {
  _key: NEW._key,
  email: NEW.email,
  role: NEW.role
}`;

const GET_USER_BY_KEY = `
FOR user IN @@collection
  FILTER user._key == @userKey
  RETURN {
    _key: NEW._key,
    email: NEW.email,
    role: NEW.role
}`;

// Entire user is returned (including password), so that password can be verified.
const GET_USER_BY_EMAIL = `
FOR user IN @@collection
  FILTER user.email == @email
  RETURN user`;

module.exports = {
  GET_USER_BY_EMAIL,
  GET_USER_BY_KEY,
  INSERT_USER
};
