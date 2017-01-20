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
const schemaKeys = {
  courseKey: Joi.string().regex(/^\d+$/).required(),
  activityKey: Joi.string().regex(/^\d+$/).required(),
  type: Joi.string().valid(['TEXT', 'IMAGE', 'VIDEO']).required(),
  content: Joi.string().when('type', { is: 'TEXT', then: Joi.required() }),
  url: Joi.string().uri().when('type', { is: 'IMAGE', then: Joi.required() }),
  layoutWidth: Joi.number().integer().min(1).max(12).required(),
  position: Joi.number().required()
};

const assetSchema = Joi.object().keys(schemaKeys).xor('content', 'url');

const updateSchema = Joi.object().keys({
  content: schemaKeys.content.optional(),
  url: schemaKeys.url.optional(),
  layoutWidth: schemaKeys.layoutWidth.optional(),
  position: schemaKeys.position.optional()
}).min(1);

class AssetModel extends BaseModel {
  constructor(db, collectionName = ASSET_COLLECTION, schema = assetSchema) {
    super(db, collectionName, schema);
  }

  validatePartial(partialDocument) {
    return new Promise((resolve, reject) => {
      Joi.validate(partialDocument, updateSchema, (err, value) => {
        return err ? reject(err) : resolve(value);
      });
    });
  }
}

module.exports = {
  schema: assetSchema,
  Model: AssetModel,
  model: new AssetModel(db)
};
