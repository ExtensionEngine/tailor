'use strict';

const yn = require('yn');

const corsAllowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .filter(s => s)
  .map(s => s.trim());

module.exports = {
  saltRounds: parseInt(process.env.AUTH_SALT_ROUNDS, 10) || 10,
  corsAllowedOrigins,
  jwt: {
    cookieName: 'access_token',
    secret: process.env.AUTH_JWT_SECRET,
    issuer: process.env.AUTH_JWT_ISSUER
  },
  oidc: {
    enabled: yn(process.env.OIDC_ENABLED),
    clientID: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
    issuer: process.env.OIDC_ISSUER,
    jwksURL: process.env.OIDC_JWKS_URL,
    authorizationEndpoint: process.env.OIDC_AUTHORIZATION_ENDPOINT,
    tokenEndpoint: process.env.OIDC_TOKEN_ENDPOINT,
    userInfoEndpoint: process.env.OIDC_USERINFO_ENDPOINT,
    logoutEndpoint: process.env.OIDC_LOGOUT_ENDPOINT
  },
  session: {
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    proxy: true,
    cookie: { secure: false }
  }
};
