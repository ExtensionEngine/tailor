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

const GET_USER_BY_EMAIL = `
FOR user IN @@collection
  FILTER user.email == @email
  RETURN user
`;

class AuthError {
  constructor() {
    this.name = 'AuthError';
    this.message = 'Invalid user email or password';
    this.isAuthError = true;
  }
}

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
      .then(validUser => this.hashPassword(validUser))
      .then(hashedUser => this.db.query(INSERT_USER, {
        '@collection': this.collectionName,
        hashedUser
      }))
      .then(cursor => cursor.next());
  }

  getByEmail(email) {
    return this.db
      .query(GET_USER_BY_EMAIL, {
        '@collection': this.collectionName,
        email
      })
      .then(cursor => cursor.next());
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
  COLLECTION_NAME,
  schema: userSchema,
  Model: UserModel,
  model: new UserModel(db)
};
