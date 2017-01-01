'use strict';

const locals = require('../../shared/io').locals;

function loadUser(userModel) {
  return (req, res, next) => {
    userModel
      .getByKey(req.params.userKey)
      .then(user => {
        locals.save(req, 'user', user);
        next();
      })
      .catch(next);
  };
}

module.exports = loadUser;
