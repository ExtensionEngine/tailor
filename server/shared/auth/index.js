'use strict';

const { auth: config, origin } = require('../../../config/server');
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const Audience = require('./audience');
const auth = require('./authenticator');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local');
const OIDCStrategy = require('./oidc');
const path = require('path');
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
  ...config.jwt,
  audience: Audience.Scope.Access,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderWithScheme(config.jwt.scheme),
    ExtractJwt.fromUrlQueryParameter('token'),
    ExtractJwt.fromBodyField('token')
  ]),
  secretOrKey: config.jwt.secret
}, verifyJWT));

auth.use('token', new JwtStrategy({
  ...config.jwt,
  audience: Audience.Scope.Setup,
  jwtFromRequest: ExtractJwt.fromBodyField('token'),
  secretOrKeyProvider
}, verifyJWT));

config.oidc.enabled && auth.use('oidc', new OIDCStrategy({
  ...config.oidc,
  callbackURL: apiUrl('/oidc/callback')
}, verifyOIDC));

auth.serializeUser((user, done) => done(null, user));
auth.deserializeUser((user, done) => done(null, user));

module.exports = auth;

function verifyJWT(payload, done) {
  return User.findByPk(payload.id)
    .then(user => done(null, user || false))
    .error(err => done(err, false));
}

function verifyOIDC(_tokenSet, { email }, done) {
  return User.findOne({ where: { email }, rejectOnEmpty: true })
    .then(user => done(null, user))
    .catch(err => done(Object.assign(err, { email }), false));
}

function secretOrKeyProvider(_, rawToken, done) {
  const { id } = jwt.decode(rawToken);
  return User.findByPk(id, { rejectOnEmpty: true })
    .then(user => user.getTokenSecret())
    .then(secret => done(null, secret))
    .catch(err => done(err));
}

function apiUrl(pathname) {
  return new URL(path.join('/api', pathname), origin).href;
}
