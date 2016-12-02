'use strict';

const bcrypt = require('bcryptjs');
const Joi = require('joi');
const config = require('../../config/server');
const db = require('../shared/database').db;
const BaseModel = require('../base.model');

/**
 * @swagger
 * definitions:
 *   UserInput:
 *     type: object
 *     required:
 *     - email
 *     - password
 *     properties:
 *       email:
 *         type: string
 *         description: user email
 *       password:
 *         type: string
 *         description: user password
 *   UserOutput:
 *     type: object
 *     required:
 *     - _key
 *     - email
 *     properties:
 *       _key:
 *         type: string
 *         description: unique user identifier
 *       email:
 *         type: string
 *         description: user email
 */
const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const COLLECTION_NAME = 'user';

const INSERT_USER = `
INSERT @user IN @@collection
RETURN {
  _key: NEW._key,
  email: NEW.email
}
`;

class UserModel extends BaseModel {
  constructor(db, collectionName = COLLECTION_NAME, schema = userSchema) {
    super(db, collectionName, schema);
  }

  hashPassword(user) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(user.password, config.auth.saltRounds, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          user.password = hash;
          resolve(user);
        }
      });
    });
  }

  comparePasswords(p1, p2) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(p1, p2, (err, result) => err ? reject(err) : resolve(result));
    });
  }

  create(user) {
    return this
      .validate(user)
      .then(user => this.hashPassword(user))
      .then(user => this.db.query(INSERT_USER, {
        '@collection': this.collectionName,
        user
      }))
      .then(cursor => cursor.next());
  }
}

module.exports = {
  COLLECTION_NAME,
  schema: userSchema,
  Model: UserModel,
  model: new UserModel(db)
};
