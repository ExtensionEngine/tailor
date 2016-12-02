'use strict';

const BaseController = require('../base.controller');
const userModel = require('./user.model').model;

class UserController extends BaseController {
  constructor(model = userModel, resourceKey = 'userKey') {
    super(model, resourceKey);

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login(req, res, next) {
    res.status(403).json();
  }

  logout(req, res, next) {
    res.status(403).json();
  }
}

module.exports = {
  Controller: UserController,
  controller: new UserController()
};
