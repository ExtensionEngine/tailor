'use strict';

const { Authenticator } = require('passport');
const autobind = require('auto-bind');
const { IncomingMessage } = require('http');

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

  authenticate(strategy, { failWithError = true, ...options } = {}) {
    // NOTE: Setup passport to forward errors down the middleware chain
    // https://github.com/jaredhanson/passport/blob/ad5fe1df/lib/middleware/authenticate.js#L171
    return super.authenticate(strategy, { ...options, failWithError });
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
