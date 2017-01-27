'use strict';

const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcryptjs'));
const config = require('../../config/server');
const db = require('../shared/database').sequelize;
const jwt = require('jsonwebtoken');
const mail = require('../shared/mail');
const Sequelize = require('sequelize');
const { user: role } = require('../../config/shared').role;

const AUTH_SECRET = process.env.AUTH_SESSION_SECRET;

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
 *     - id
 *     - email
 *     - role
 *     properties:
 *       id:
 *         type: number
 *         description: unique user identifier
 *       email:
 *         type: string
 *         description: user email
 *       role:
 *         type: string
 *         description: user role
 */
const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    validate: { isEmail: true },
    unique: { msg: 'The specified email address is already in use.' }
  },
  password: {
    type: Sequelize.STRING,
    validate: { notEmpty: true, len: [5, 100] }
  },
  role: {
    type: Sequelize.ENUM(role.ADMIN, role.USER),
    defaultValue: role.USER
  },
  token: {
    type: Sequelize.STRING,
    unique: true
  }
}, {
  instanceMethods: {
    authenticate(password) {
      return bcrypt.compare(password, this.password) ? this : null;
    },
    encrypt(val) {
      return bcrypt.hash(val, config.auth.saltRounds);
    },
    encryptPassword() {
      return this.encrypt(this.password).then(pw => (this.password = pw));
    },
    createToken(payload) {
      return jwt.sign({ payload }, AUTH_SECRET, { expiresIn: '2 days' });
    },
    invite() {
      return mail.invite(this).then(() => this);
    },
    sendResetToken() {
      return this.createToken({}).then(token => {
        this.token = token;
        return this.save();
      });
    }
  },
  hooks: {
    beforeCreate(user) {
      return user.encryptPassword();
    },
    beforeUpdate(user) {
      return user.changed('password')
        ? user.encryptPassword()
        : Promise.resolve();
    },
    beforeBulkCreate(users) {
      let updates = [];
      users.forEach(user => updates.push(user.encryptPassword()));
      return Promise.all(updates);
    }
  }
});

module.exports = User;
