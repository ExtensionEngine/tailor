'use strict';

const BaseController = require('../base.controller');
const activityModel = require('./activity.model');
const io = require('../shared/io');
const locals = io.locals;

class ActivityController extends BaseController {
  constructor(model = activityModel, resourceKey = 'activityKey') {
    super(model, resourceKey);

    this.reorder = this.reorder.bind(this);
  }

  create(req, res, next) {
    const courseId = locals.load(req, 'course._key');
    const activity = {
      name: req.body.name,
      type: req.body.type,
      courseId,
      parentId: req.body.parentKey,
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
    this.model
      .findOne({
        where: { id: req.params.activityKey }
      })
      .then(data => {
        if (data) {
          io.setOK(res, data);
          return next();
        }

        // TODO(matej): if other model methods return empty results, add a new
        // error class, make an instance, and pass it to next().
        return res.status(404).json();
      })
      .catch(next);
  }

  list(req, res, next) {
    const courseId = locals.load(req, 'course._key');

    this.model
      .findAllByCourse(courseId)
      .then(data => {
        io.setOK(res, data);
        next();
      })
      .catch(next);
  }

  remove(req, res, next) {
    this.model
      .findById(req.params.activityKey)
      .deleteTree()
      .then(data => {
        io.setOK(res, data);
        next();
      })
      .catch(next);
  }

  reorder(req, res, next) {
    this.model
      .findById(req.params.activityKey)
      .reorder(req.body.position)
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
