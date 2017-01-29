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
    const id = req.params.activityKey;

    this.model
      .findById(id)
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
    const courseId = req.params.courseKey;

    this.model
      .findByCourseAndOrder(courseId)
      .then(data => {
        io.setOK(res, data);
        next();
      })
      .catch(next);
  }

  remove(req, res, next) {
    const id = req.params.activityKey;

    this.model
      .findById(id)
      .deleteTree()
      .then(data => {
        io.setOK(res, data);
        next();
      })
      .catch(next);
  }

  reorder(req, res, next) {
    const id = req.params.activityKey;
    const position = req.body.position;

    this.model
      .findById(id)
      .reorder(position)
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
