'use strict';

const Audience = require('./audience');
const { Authenticator } = require('passport');
const autobind = require('auto-bind');
const { auth: config } = require('../../../config/server');
const { IncomingMessage } = require('http');
const isUndefined = require('lodash/isUndefined');

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

  authenticate(strategy, { setCookie = false, failWithError = true, ...options } = {}) {
    // NOTE: Setup passport to forward errors down the middleware chain
    // https://github.com/jaredhanson/passport/blob/ad5fe1df/lib/middleware/authenticate.js#L171

    if (!setCookie) return super.authenticate(strategy, { ...options, failWithError });

    return (req, res, next) => {
      const wrappedNext = err => {
        if (!isUndefined(err)) return next(err);
        const { user } = req;
        const token = user.createToken({
          audience: Audience.Scope.Access,
          expiresIn: '5 days'
        });
        const { name, ...options } = config.jwt.cookie;
        res.cookie(config.jwt.cookie.name, token, {
          ...options,
          maxAge: 5 * 1000 * 60 * 60 * 24 // 5 days
        });
        return next();
      };
      return super.authenticate(strategy, { ...options, failWithError })(req, res, wrappedNext);
    };
  }

  logout({ middleware = false } = {}) {
    return (_, res, next) => {
      res.clearCookie(config.jwt.cookie.name);
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
