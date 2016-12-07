'use strict';

const BaseController = require('../base.controller');
const activityModel = require('./activity.model').model;

class ActivityController extends BaseController {
  constructor(model = activityModel, resourceKey = 'activityKey') {
    super(model, resourceKey);
  }
}

module.exports = {
  Controller: ActivityController,
  controller: new ActivityController()
};
