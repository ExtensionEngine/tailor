'use strict';

const BaseController = require('../base.controller');
const activityModel = require('./activity.model').model;
const io = require('../shared/io');
const locals = io.locals;

class ActivityController extends BaseController {
  constructor(model = activityModel, resourceKey = 'activityKey') {
    super(model, resourceKey);
  }

  create(req, res, next) {
    const courseKey = locals.load(req, 'course._key');
    const activity = {
      name: req.body.name,
      type: req.body.type,
      courseKey,
      parentKey: req.body.parentKey,
      position: req.body.position
    };
    this.model
      .create(activity)
      .then(data => {
        io.setCreated(res, data);
        next();
      })
      .catch(next);
  }

  show(req, res, next) {
    const courseKey = locals.load(req, 'course._key');
    this.model
      .getByKey(courseKey, req.params.activityKey)
      .then(data => {
        io.setOK(res, data);
        next();
      })
      .catch(next);
  }

  list(req, res, next) {
    const courseKey = locals.load(req, 'course._key');
    this.model
      .getMany(courseKey)
      .then(data => {
        io.setOK(res, data);
        next();
      })
      .catch(next);
  }
}

module.exports = {
  Controller: ActivityController,
  controller: new ActivityController()
};
