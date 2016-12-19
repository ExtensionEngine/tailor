'use strict';

const Joi = require('joi');
const BaseModel = require('../base.model');
const database = require('../shared/database');

const db = database.db;
const ASSET_COLLECTION = database.collection.ASSET;

/**
 * @swagger
 * definitions:
 *   AssetInput:
 *     type: object
 *     required:
 *     - type
 *     properties:
 *       type:
 *         type: string
 *         description: asset type
 *   AssetOutput:
 *     type: object
 *     required:
 *     - _key
 *     - type
 *     properties:
 *       _key:
 *         type: string
 *         description: unique asset identifier
 *       type:
 *         type: string
 *         description: asset type
 */

const assetSchema = Joi.object().keys({
  type: Joi.string().min(3).max(100).required(),
  courseKey: Joi.string().regex(/[0-9]+/).required()
});

class AssetModel extends BaseModel {
  constructor(db, collectionName = ASSET_COLLECTION, schema = assetSchema) {
    super(db, collectionName, schema);
  }
}

module.exports = {
  schema: assetSchema,
  Model: AssetModel,
  model: new AssetModel(db)
};
