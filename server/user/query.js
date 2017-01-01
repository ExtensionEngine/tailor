'use strict';

const INSERT_USER = `
INSERT @user IN @@collection
RETURN KEEP(NEW, ['_key', 'email', 'role', 'courses'])`;

const GET_USER_BY_KEY = `
FOR user IN @@collection
  FILTER user._key == @userKey
  RETURN KEEP(user, ['_key', 'email', 'role', 'courses'])`;

// Entire user is returned (including password), so that password can be verified.
const GET_USER_BY_EMAIL = `
FOR user IN @@collection
  FILTER user.email == @email
  RETURN user`;

const ADD_COURSE_TO_USER = `
FOR user IN @@collection
  FILTER user._key == @userKey
  UPDATE user WITH {
    courses: APPEND(user.courses, @courseKey, true)
  } IN @@collection
  RETURN KEEP(NEW, ['_key', 'email', 'role', 'courses'])`;

const REMOVE_COURSE_FROM_USER = `
FOR user IN @@collection
  FILTER user._key == @userKey
  UPDATE user WITH {
    courses: REMOVE_VALUE(user.courses, @courseKey)
  } IN @@collection
  RETURN KEEP(NEW, ['_key', 'email', 'role', 'courses'])`;

module.exports = {
  ADD_COURSE_TO_USER,
  GET_USER_BY_EMAIL,
  GET_USER_BY_KEY,
  INSERT_USER,
  REMOVE_COURSE_FROM_USER
};
