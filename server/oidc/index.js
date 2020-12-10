'use strict';

const { authenticate } = require('../shared/auth');
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

const isSilentAuth = req => req.query.silent === 'true';
const isResign = req => req.query.resign === 'true';

const getPrompt = req => {
  if (isResign(req)) return 'login';
  if (isSilentAuth(req)) return 'none';
  return '';
};

const isOIDCError = err => OIDCErrors.some(Ctor => err instanceof Ctor);

router
  .get('/', (req, res, next) => {
    const prompt = getPrompt(req);
    const params = { scope, ...prompt && { prompt } };
    if (req.query.silent === 'true') {
      const strategy = req.passport.strategy('oidc');
      const callbackUri = new URL(strategy.options.callbackURL);
      callbackUri.searchParams.set('silent', 'true');
      params.redirect_uri = callbackUri.href;
    }
    return authenticate('oidc', params)(req, res, next);
  })
  .get('/callback', login)
  .use((err, req, res, next) => {
    if (!isOIDCError(err) && !isSilentAuth(req)) {
      return res.redirect(ACCESS_DENIED_ROUTE + err.email);
    }
    const template = path.resolve(__dirname, './error.mustache');
    const status = err.status || BAD_REQUEST;
    return res.render(template, err, (_, html) => {
      res.status(status).send(html);
    });
  });

module.exports = {
  path: '/oidc',
  router
};

function login(req, res, next) {
  authenticate('oidc', { setCookie: true })(req, res, err => {
    if (err) return next(err);
    if (!isSilentAuth(req)) return res.redirect('/');
    const template = path.resolve(__dirname, './authenticated.mustache');
    return res.render(template);
  });
}
