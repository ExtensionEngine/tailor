'use-strict';

const BaseController = require('../base.controller');
const assetModel = require('./asset.model').model;

class AssetController extends BaseController {
  constructor(model = assetModel, resourceKey = 'assetKey') {
    super(model, resourceKey);
  }
}

module.exports = {
  Controller: AssetController,
  controller: new AssetController()
};
