'use strict';

const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcryptjs'));
const config = require('../../config/server');
const mail = require('../shared/mail');
const jwt = require('jsonwebtoken');
const { user: role } = require('../../config/shared').role;

const AUTH_SECRET = process.env.AUTH_JWT_SECRET;

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
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: { isEmail: true },
      unique: { msg: 'The specified email address is already in use.' }
    },
    password: {
      type: DataTypes.STRING,
      validate: { notEmpty: true, len: [5, 100] }
    },
    role: {
      type: DataTypes.ENUM(role.ADMIN, role.USER),
      defaultValue: role.USER
    },
    token: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    getterMethods: {
      profile() {
        return {
          id: this.id,
          email: this.email,
          role: this.role
        };
      }
    },
    classMethods: {
      associate(models) {
        User.belongsToMany(models.Course, { through: models.CourseUser });
      },
      invite(user) {
        return User.create(user).then(user => {
          user.token = user.createToken();
          mail.invite(user);
          return user.save();
        });
      }
    },
    instanceMethods: {
      isAdmin() {
        return this.role === role.ADMIN;
      },
      authenticate(password) {
        if (!this.password) return Promise.resolve(false);
        return bcrypt
          .compare(password, this.password)
          .then(match => match ? this : false);
      },
      encrypt(val) {
        return bcrypt.hash(val, config.auth.saltRounds);
      },
      encryptPassword() {
        if (!this.password) return Promise.resolve(false);
        return this
          .encrypt(this.password)
          .then(pw => (this.password = pw));
      },
      createToken() {
        const payload = { id: this.id, email: this.email };
        return jwt.sign(payload, AUTH_SECRET, { expiresIn: '5 days' });
      },
      sendResetToken() {
        this.token = this.createToken();
        mail.resetPassword(this);
        return this.save();
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
    },
    freezeTableName: true
  });

  return User;
};
