'use strict';

const { ExtractJwt, Strategy } = require('passport-jwt');
const passport = require('passport');
const { User } = require('../database');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.AUTH_JWT_SECRET
  // issuer: process.env.AUTH_JWT_ISSUER,
  // audience: process.env.SERVER_URL
};

passport.use(new Strategy(jwtOptions, (payload, done) => {
  return User.findByPk(payload.id)
    .then(user => done(null, user || false))
    .error(err => done(err, false));
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
