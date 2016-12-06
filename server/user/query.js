const INSERT_USER = `
INSERT @user IN @@collection
RETURN {
  _key: NEW._key,
  email: NEW.email
}
`;

const GET_USER_BY_EMAIL = `
FOR user IN @@collection
  FILTER user.email == @email
  RETURN user
`;

module.exports = {
  INSERT_USER,
  GET_USER_BY_EMAIL
};
