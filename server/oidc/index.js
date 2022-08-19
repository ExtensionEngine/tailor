import { authenticate, logout } from '../shared/auth/index.js';
import { BAD_REQUEST } from 'http-status-codes';
import express from 'express';
import { fileURLToPath } from 'node:url';
import get from 'lodash/get';
import { errors as OIDCError } from 'openid-client';
import path from 'node:path';
import { URL } from 'url';

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
  const idToken = get(req.authData, 'oidc.tokenSet.id_token');
  return { redirect_uri: callbackUri.href, id_token_hint: idToken };
};

const isOIDCError = err => OIDCErrors.some(Ctor => err instanceof Ctor);

router
  .get('/', authRequestHandler)
  .get('/callback', idpCallbackHandler, (_, res) => res.redirect('/'))
  .use(accessDeniedHandler, defaultErrorHandler);

export default {
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
