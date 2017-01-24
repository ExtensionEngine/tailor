'use strict';

const assign = require('lodash/assign');
const BaseModel = require('../base.model');
const bcrypt = require('bcryptjs');
const config = require('../../config/server');
const database = require('../shared/database');
const Joi = require('joi');
const { user: role, userRoleRegex } = require('../../config/shared').role;
const query = require('./query');

const db = database.db;
const USER_COLLECTION = database.collection.USER;

/**
 * @swagger
 * definitions:
 *   UserInput:
 *     type: object
 *     required:
 *     - email
 *     - password
 *     - role
 *     properties:
 *       email:
 *         type: string
 *         description: user email
 *       password:
 *         type: string
 *         description: user password
 *       role:
 *         type: string
 *         description: user role
 *   UserOutput:
 *     type: object
 *     required:
 *     - _key
 *     - email
 *     - role
 *     properties:
 *       _key:
 *         type: string
 *         description: unique user identifier
 *       email:
 *         type: string
 *         description: user email
 *       role:
 *         type: string
 *         description: user role
 */
const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().default(role.USER).regex(userRoleRegex)
});

class AuthError {
  constructor() {
    this.name = 'AuthError';
    this.message = 'Invalid user email or password';
    this.isAuthError = true;
  }
}

class UserModel extends BaseModel {
  constructor(db, collectionName = USER_COLLECTION, schema = userSchema) {
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
      .then(this.markAsCreated)
      .then(validUser => this.hashPassword(validUser))
      .then(hashedUser => this.db.query(query.INSERT_USER, {
        '@collection': this.collectionName,
        user: hashedUser
      }))
      .then(cursor => cursor.next());
  }

  getByKey(userKey) {
    return this.db
      .query(query.GET_USER_BY_KEY, {
        '@collection': this.collectionName,
        userKey
      })
      .then(cursor => cursor.next());
  }

  getByEmail(email) {
    return this.db
      .query(query.GET_USER_BY_EMAIL, {
        '@collection': this.collectionName,
        email
      })
      .then(cursor => cursor.next());
  }

  updateByKey(key, partialDocument) {
    // Omit password on patch
    return this
      .validatePartial(partialDocument, ['password'])
      .then(this.markAsUpdated)
      .then(validDocument => this.collection.update(
        { _key: key },
        validDocument,
        { returnNew: true }
      ))
      .then(result => result.new);
  }

  validateCredentials(email, password) {
    let user;
    return this
      .getByEmail(email)
      .then(maybeUser => {
        if (maybeUser) {
          user = maybeUser;
          return this.comparePasswords(password, user.password);
        }

        return Promise.reject(new AuthError());
      })
      .then(passwordsMatch => {
        delete user.password;
        return passwordsMatch ? user : Promise.reject(new AuthError());
      });
  }
}

module.exports = {
  schema: userSchema,
  Model: UserModel,
  model: new UserModel(db)
};
