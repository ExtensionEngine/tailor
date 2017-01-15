'use strict';

const bcrypt = require('bcryptjs');
const Joi = require('joi');
const config = require('../../config/server');
const database = require('../shared/database');
const BaseModel = require('../base.model');
const query = require('./query');
const role = require('../../config/shared').role;

const db = database.db;
const USER_COLLECTION = database.collection.USER;

/**
 * @swagger
 * definitions:
 *   UserInput:
 *     type: object
 *     required:
 *     - email
 *       password
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
 *       courses:
 *         type: array
 *         description: list of courses user can access
 *   UserOutput:
 *     type: object
 *     required:
 *     - _key
 *       email
 *       isAdmin
 *       role
 *       courses
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
 *       courses:
 *         type: array
 *         description: list of courses user can access
 */
const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().default(role.default).regex(role.validationRegex),
  courses: Joi.array().items(Joi.string()).default([])
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

  static getUserEmailFilter(email) {
    const filter = 'FILTER CONTAINS(LOWER(user.email), LOWER(@email))';
    const bindVars = { email };
    return email ? [filter, bindVars] : ['', {}];
  }

  getUsersForCourse(filter) {
    const { courseKey, email } = filter;
    const [emailFilter, emailBindVars] = UserModel.getUserEmailFilter(email);

    const query = `
      FOR user IN @@collection
        FILTER POSITION(user.courses, @courseKey)
        ${emailFilter}
      RETURN user
    `;
    const bindVars = Object.assign({
      '@collection': this.collectionName,
      courseKey
    }, emailBindVars);

    return this.db
      .query(query, bindVars)
      .then(cursor => cursor.all());
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

  grantAccessToCourse(userKey, courseKey) {
    return this.db
      .query(query.ADD_COURSE_TO_USER, {
        '@collection': this.collectionName,
        userKey,
        courseKey
      })
      .then(cursor => cursor.next());
  }

  revokeAccessToCourse(userKey, courseKey) {
    return this.db
      .query(query.REMOVE_COURSE_FROM_USER, {
        '@collection': this.collectionName,
        userKey,
        courseKey
      })
      .then(cursor => cursor.next());
  }
}

module.exports = {
  schema: userSchema,
  Model: UserModel,
  model: new UserModel(db)
};
