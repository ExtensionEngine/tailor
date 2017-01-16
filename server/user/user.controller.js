'use strict';

const BaseController = require('../base.controller');
const userModel = require('./user.model').model;
const io = require('../shared/io');

class UserController extends BaseController {
  constructor(model = userModel, resourceKey = 'userKey') {
    super(model, resourceKey);

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.listUsersForCourse = this.listUsersForCourse.bind(this);
    this.grantAccessToCourse = this.grantAccessToCourse.bind(this);
    this.revokeAccessToCourse = this.revokeAccessToCourse.bind(this);
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

  listUsersForCourse(req, res, next) {
    const courseKey = req.params.courseKey;
    const email = io.locals.load(req, 'search').query;

    // TODO(marko): Should filter user roles based on current user role.
    this.model.getUsersForCourse({ courseKey, email })
      .then(users => {
        io.setOK(res, users);
        next();
      })
      .catch(next);
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
