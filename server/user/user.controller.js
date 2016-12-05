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
    res.status(200).json({ data: req.user });
  }

  logout(req, res, next) {
    req.logout();
    res.status(204).json();
  }
}

module.exports = {
  Controller: UserController,
  controller: new UserController()
};
