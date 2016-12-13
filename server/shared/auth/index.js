'use strict';

const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const userModel = require('../../user/user.model').model;

passport.use(new Strategy({
  usernameField: 'email'
}, (email, password, callback) => userModel
  .validateCredentials(email, password)
  .then(user => callback(null, user))
  .catch(callback)
));

passport.serializeUser((user, callback) => callback(null, user._key));

passport.deserializeUser((key, callback) => userModel
  .getByKey(key)
  .then(user => {
    delete user.password;
    return callback(null, user);
  })
  .catch(callback)
);
