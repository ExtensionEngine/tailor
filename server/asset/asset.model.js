'use-strict';

const Joi = require('joi');
const BaseModel = require('../base.model');
const db = require('../shared/database').db;

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

const COLLECTION_NAME = 'asset';

class AssetModel extends BaseModel {
  constructor(db, collectionName = COLLECTION_NAME, schema = assetSchema) {
    super(db, collectionName, schema);
  }
}

module.exports = {
  COLLECTION_NAME,
  schema: assetSchema,
  Model: AssetModel,
  model: new AssetModel(db)
};
