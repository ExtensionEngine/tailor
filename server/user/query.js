'use strict';

const INSERT_USER = `
INSERT @user IN @@collection
RETURN UNSET(NEW, 'password')`;

const GET_USER_BY_KEY = `
FOR user IN @@collection
  FILTER user._key == @userKey
  RETURN UNSET(user, 'password')`;

// Entire user is returned (including password), so that password can be verified.
const GET_USER_BY_EMAIL = `
FOR user IN @@collection
  FILTER user.email == @email
  RETURN user`;

const INVITE_USER_TO_COURSE = `
  UPSERT { email: @email }
  INSERT { email: @email, role: @role, courses: @courses, password: @password }
  UPDATE { courses: APPEND(OLD.courses, @courses, true), role: @role } IN @@collection
  RETURN UNSET(NEW, 'password')`;

const REMOVE_COURSE_FROM_USER = `
FOR user IN @@collection
  FILTER user._key == @userKey
  UPDATE user WITH {
    courses: REMOVE_VALUE(user.courses, @courseKey)
  } IN @@collection
  RETURN UNSET(NEW, 'password')`;

module.exports = {
  GET_USER_BY_EMAIL,
  GET_USER_BY_KEY,
  INSERT_USER,
  INVITE_USER_TO_COURSE,
  REMOVE_COURSE_FROM_USER
};
