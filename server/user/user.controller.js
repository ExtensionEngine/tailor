'use strict';

const BaseController = require('../base.controller');
const userModel = require('./user.model').model;
const io = require('../shared/io');

class UserController extends BaseController {
  constructor(model = userModel, resourceKey = 'userKey') {
    super(model, resourceKey);

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login(req, res, next) {
    const user = req.user;
    io.setOK(res, user);
    next();
  }

  logout(req, res, next) {
    req.session.destroy();
    io.setEmpty(res);
    next();
  }
}

module.exports = {
  Controller: UserController,
  controller: new UserController()
};
