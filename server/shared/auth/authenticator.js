'use strict';

const addDays = require('date-fns/addDays');
const Audience = require('./audience');
const { Authenticator } = require('passport');
const autobind = require('auto-bind');
const { auth: config } = require('../../../config/server');
const { IncomingMessage } = require('http');
const storageProxy = require('../storage/proxy');
const isFunction = arg => typeof arg === 'function';

class Auth extends Authenticator {
  constructor() {
    super();
    autobind(this);
  }

  initialize(options = {}) {
    Object.defineProperty(IncomingMessage.prototype, 'passport', {
      get: () => this
    });
    return super.initialize(options);
  }

  authenticate(strategy, ...args) {
    const [options, callback] = parseAuthenticateOptions(args);
    // NOTE: Setup passport to forward errors down the middleware chain
    // https://github.com/jaredhanson/passport/blob/ad5fe1df/lib/middleware/authenticate.js#L171
    if (options.failWithError !== false) options.failWithError = true;
    const authenticateUser = super.authenticate(strategy, options, callback);
    return (req, res, next) => {
      const authenticateCallback = options.setCookie
        ? this._wrapAuthenticateCallback(req, res, next, strategy)
        : next;
      return authenticateUser(req, res, authenticateCallback);
    };
  }

  _wrapAuthenticateCallback(req, res, next, strategy) {
    return (...args) => {
      if (args.length > 0) return next(args[0]);
      const { user } = req;
      const token = user.createToken({
        audience: Audience.Scope.Access,
        expiresIn: '5 days'
      });
      const { name, signed, secure, httpOnly } = config.jwt.cookie;
      const expires = addDays(new Date(), 5);
      const options = { signed, secure, expires, httpOnly };
      res.cookie(name, token, options);
      const authData = { strategy, [strategy]: user.authData };
      res.cookie('auth', authData, options);
      req.authData = authData;
      return next();
    };
  }

  logout({ middleware = false } = {}) {
    const storageCookies = storageProxy.getCookieNames();
    return (_, res, next) => {
      res.clearCookie(config.jwt.cookie.name);
      res.clearCookie('auth');
      storageCookies.forEach(name => res.clearCookie(name));
      return middleware ? next() : res.end();
    };
  }

  strategy(strategyName) {
    const strategy = this._strategy(strategyName);
    if (!strategy) {
      throw new Error(`Error: Unknown authentication strategy "${strategyName}"`);
    }
    return strategy;
  }
}

module.exports = new Auth();

function parseAuthenticateOptions(args) {
  if (isFunction(args[0])) return [{}, args[0]];
  return [args[0] || {}, args[1]];
}
