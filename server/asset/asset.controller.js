'use strict';

const BaseController = require('../shared/controller/base.controller');
const { Asset } = require('../shared/database/sequelize');
const io = require('../shared/io');

class AssetController extends BaseController {
  constructor(model = Asset, resourceKey = 'assetId') {
    super(model, resourceKey);
  }

  listFiltered(req, res, next) {
    const activityId = io.locals.load(req, 'searchTerms').activityId || null;
    return this.model
      .findAllByActivity(activityId)
      .then(data => {
        io.setOK(res, this.model.serializeMany(data));
        next();
      })
      .catch(next);
  }

  show(req, res, next) {
    return this.model
      .findById(req.params.assetId)
      .then(data => {
        io.setOK(res, data.serialize());
        next();
      })
      .catch(next);
  }

  create(req, res, next) {
    this.model
      .create(req.body)
      .then(data => {
        io.setCreated(res, data.serialize());
        next();
      })
      .catch(next);
  }

  patch(req, res, next) {
    this.model
      .updateById(req.params.assetId, req.body)
      .then(data => {
        io.setOK(res, data.serialize());
        next();
      })
      .catch(next);
  }

  remove(req, res, next) {
    this.model
      .deleteById(req.params.assetId)
      .then(data => {
        io.setOK(res, data);
        next();
      })
      .catch(next);
  }
}

module.exports = {
  Controller: AssetController,
  controller: new AssetController()
};
