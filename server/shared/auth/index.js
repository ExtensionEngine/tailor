'use strict';

const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const Audience = require('./audience');
const auth = require('./authenticator');
const config = require('../../../config/server').auth;
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local');
const { User } = require('../database');

const options = {
  usernameField: 'email',
  session: false
};

auth.use(new LocalStrategy(options, (email, password, done) => {
  return User.findOne({ where: { email } })
    .then(user => user && user.authenticate(password))
    .then(user => done(null, user || false))
    .error(err => done(err, false));
}));

auth.use(new JwtStrategy({
  ...config,
  audience: Audience.Scope.Access,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderWithScheme(config.scheme),
    ExtractJwt.fromUrlQueryParameter('token'),
    ExtractJwt.fromBodyField('token')
  ]),
  secretOrKey: config.secret
}, verify));

auth.use('token', new JwtStrategy({
  ...config,
  audience: Audience.Scope.Setup,
  jwtFromRequest: ExtractJwt.fromBodyField('token'),
  secretOrKeyProvider
}, verify));

auth.serializeUser((user, done) => done(null, user));
auth.deserializeUser((user, done) => done(null, user));

module.exports = {
  initialize(options = {}) {
    return auth.initialize(options);
  },
  authenticate(strategy, options = {}) {
    // NOTE: Setup passport to forward errors down the middleware chain
    // https://github.com/jaredhanson/passport/blob/ad5fe1df/lib/middleware/authenticate.js#L171
    return auth.authenticate(strategy, { ...options, failWithError: true });
  }
};

function verify(payload, done) {
  return User.findByPk(payload.id)
    .then(user => done(null, user || false))
    .error(err => done(err, false));
}

function secretOrKeyProvider(_, rawToken, done) {
  const { id } = jwt.decode(rawToken);
  return User.findByPk(id, { rejectOnEmpty: true })
    .then(user => user.getTokenSecret())
    .then(secret => done(null, secret))
    .catch(err => done(err));
}
