import { auth as config, origin } from '../../../config/server/index.js';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import Audience from './audience.js';
import auth from './authenticator.js';
import get from 'lodash/get';
import jwt from 'jsonwebtoken';
import LocalStrategy from 'passport-local';
import OIDCStrategy from './oidc.js';
import path from 'node:path';
import { User } from '../database/index.js';

const options = {
  usernameField: 'email',
  session: false
};

auth.use(new LocalStrategy(options, (email, password, done) => {
  return User.unscoped().findOne({ where: { email } })
    .then(user => user && user.authenticate(password))
    .then(user => done(null, user || false))
    .error(err => done(err, false));
}));

auth.use(new JwtStrategy({
  ...config.jwt,
  audience: Audience.Scope.Access,
  jwtFromRequest: ExtractJwt.fromExtractors([
    extractJwtFromCookie,
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

export default auth;

function verifyJWT(payload, done) {
  return User.unscoped().findByPk(payload.id)
    .then(user => done(null, user || false))
    .error(err => done(err, false));
}

function verifyOIDC(tokenSet, profile, done) {
  return findOrCreateOIDCUser(profile)
    .then(user => {
      user.authData = { tokenSet };
      done(null, user);
    })
    .catch(err => done(Object.assign(err, { email: profile.email }), false));
}

function extractJwtFromCookie(req) {
  const path = config.jwt.cookie.signed ? 'signedCookies' : 'cookies';
  return get(req[path], config.jwt.cookie.name, null);
}

function secretOrKeyProvider(_, rawToken, done) {
  const { id } = jwt.decode(rawToken) || {};
  return User.unscoped().findByPk(id, { rejectOnEmpty: true })
    .then(user => user.getTokenSecret())
    .then(secret => done(null, secret))
    .catch(err => done(err));
}

function apiUrl(pathname) {
  return new URL(path.join('/api', pathname), origin).href;
}

function findOrCreateOIDCUser({ email, firstName, lastName }) {
  if (!config.oidc.enableSignup) {
    return User.findOne({ where: { email }, rejectOnEmpty: true });
  }
  const defaults = { firstName, lastName, role: config.oidc.defaultRole };
  return User.findOrCreate({ where: { email }, defaults })
    .then(([user]) => user);
}
