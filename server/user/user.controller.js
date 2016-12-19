'use strict';

const BaseController = require('../base.controller');
const userModel = require('./user.model').model;
const io = require('../shared/io');

class UserController extends BaseController {
  constructor(model = userModel, resourceKey = 'userKey') {
    super(model, resourceKey);

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.grantAccessToCourse = this.grantAccessToCourse.bind(this);
    this.revokeAccessToCourse = this.revokeAccessToCourse.bind(this);
  }

  login(req, res, next) {
    const user = req.user;
    io.setOK(res, user);
    next();
  }

  logout(req, res, next) {
    req.logout();
    io.setEmpty(res);
    next();
  }

  grantAccessToCourse(req, res, next) {
    const { userKey, courseKey } = req.params;
    this.model
      .grantAccessToCourse(userKey, courseKey)
      .then(user => {
        io.setOK(res, user);
        next();
      })
      .catch(next);
  }

  revokeAccessToCourse(req, res, next) {
    const { userKey, courseKey } = req.params;
    this.model
      .revokeAccessToCourse(userKey, courseKey)
      .then(user => {
        io.setOK(res, user);
        next();
      })
      .catch(next);
  }
}

module.exports = {
  Controller: UserController,
  controller: new UserController()
};
