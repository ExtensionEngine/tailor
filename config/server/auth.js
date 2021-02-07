'use strict';

const { role: { user: role } } = require('../shared');
const yn = require('yn');

const { env } = process;

const corsAllowedOrigins = (env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .filter(s => s)
  .map(s => s.trim());

module.exports = {
  saltRounds: parseInt(env.AUTH_SALT_ROUNDS, 10) || 10,
  corsAllowedOrigins,
  jwt: {
    cookie: {
      name: env.AUTH_JWT_COOKIE_NAME || 'access_token',
      secret: env.AUTH_JWT_COOKIE_SECRET,
      signed: !!env.AUTH_JWT_COOKIE_SECRET,
      secure: env.PROTOCOL === 'https' && env.HOSTNAME !== 'localhost',
      httpOnly: true
    },
    secret: env.AUTH_JWT_SECRET,
    issuer: env.AUTH_JWT_ISSUER
  },
  oidc: {
    enabled: yn(env.OIDC_ENABLED),
    clientID: env.OIDC_CLIENT_ID,
    clientSecret: env.OIDC_CLIENT_SECRET,
    issuer: env.OIDC_ISSUER,
    jwksURL: env.OIDC_JWKS_URL,
    authorizationEndpoint: env.OIDC_AUTHORIZATION_ENDPOINT,
    tokenEndpoint: env.OIDC_TOKEN_ENDPOINT,
    userInfoEndpoint: env.OIDC_USERINFO_ENDPOINT,
    logoutEndpoint: env.OIDC_LOGOUT_ENDPOINT,
    postLogoutUriKey: env.OIDC_POST_LOGOUT_URI_KEY,
    enableSignup: yn(env.OIDC_ALLOW_SIGNUP),
    defaultRole: Object.values(role)
      .find(it => it === env.OIDC_DEFAULT_ROLE) || role.USER
  },
  session: {
    resave: false,
    saveUninitialized: false,
    secret: env.SESSION_SECRET,
    proxy: true,
    cookie: { secure: false }
  }
};
