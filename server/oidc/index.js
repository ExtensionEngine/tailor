'use strict';

const { authenticate, logout } = require('../shared/auth');
const { BAD_REQUEST } = require('http-status-codes');
const { errors: OIDCError } = require('openid-client');
const path = require('path');
const router = require('express').Router();
const { URL } = require('url');

const ACCESS_DENIED_ROUTE = '/#/login?accessDenied=';

const OIDCErrors = [
  OIDCError.OPError,
  OIDCError.RPError
];
const scope = ['openid', 'profile', 'email'].join(' ');

const isSilentAuth = ({ query }) => query.silent === 'true';
const isResign = ({ query }) => query.resign === 'true';
const isLogoutRequest = ({ query }) => query.action === 'logout';
const isActiveStrategy = ({ authData = {} }) => authData.strategy === 'oidc';

const getPromptParams = req => {
  if (isResign(req)) return { prompt: 'login' };
  if (isSilentAuth(req)) return { prompt: 'none' };
  return {};
};

const getSilentAuthParams = req => {
  if (!isSilentAuth(req)) return {};
  const strategy = req.passport.strategy('oidc');
  const callbackUri = new URL(strategy.options.callbackURL);
  callbackUri.searchParams.set('silent', 'true');
  return { redirect_uri: callbackUri.href };
};

const isOIDCError = err => OIDCErrors.some(Ctor => err instanceof Ctor);

router
  .get('/', authRequestHandler)
  .get('/callback', idpCallbackHandler, (_, res) => res.redirect('/'))
  .use(accessDeniedHandler, defaultErrorHandler);

module.exports = {
  path: '/oidc',
  router
};

// Initiate login and logout actions
function authRequestHandler(req, res, next) {
  const strategy = req.passport.strategy('oidc');
  if (isLogoutRequest(req)) return strategy.logout()(req, res, next);
  const params = {
    scope,
    ...getPromptParams(req),
    ...getSilentAuthParams(req)
  };
  return authenticate('oidc', params)(req, res, next);
}

// Triggered upon OIDC provider response
function idpCallbackHandler(req, res, next) {
  if (!isLogoutRequest(req)) return login(req, res, next);
  return logout({ middleware: true })(req, res, next);
}

function accessDeniedHandler(err, req, res, next) {
  if (!isOIDCError(err) && !isSilentAuth(req)) {
    return res.redirect(ACCESS_DENIED_ROUTE + err.email);
  }
  if (isSilentAuth(req) && isActiveStrategy(req)) {
    return logout({ middleware: true })(req, res, () => next(err));
  }
  return next(err);
}

function defaultErrorHandler(err, _req, res, _next) {
  const template = path.resolve(__dirname, './error.mustache');
  const status = err.status || BAD_REQUEST;
  return res.render(template, err, (_, html) => res.status(status).send(html));
}

function login(req, res, next) {
  const params = {
    setCookie: true,
    ...(isSilentAuth(req) && getSilentAuthParams(req))
  };
  authenticate('oidc', params)(req, res, err => {
    if (err) return next(err);
    if (!isSilentAuth(req)) return res.redirect('/');
    const template = path.resolve(__dirname, './authenticated.mustache');
    return res.render(template);
  });
}
