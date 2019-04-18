'use strict';

const config = require('../../config/server');
const jwt = require('jsonwebtoken');
const mail = require('../shared/mail');
const { Model } = require('sequelize');
const Promise = require('bluebird');
const { user: Role } = require('../../config/shared').role;

const bcrypt = Promise.promisifyAll(require('bcryptjs'));
const AUTH_SECRET = process.env.AUTH_JWT_SECRET;
const noop = Function.prototype;

class User extends Model {
  static fields({ DATE, ENUM, STRING, VIRTUAL }) {
    return {
      email: {
        type: STRING,
        set(email) {
          this.setDataValue('email', email.toLowerCase());
        },
        validate: { isEmail: true },
        unique: { msg: 'The specified email address is already in use.' }
      },
      password: {
        type: STRING,
        validate: { notEmpty: true, len: [5, 100] }
      },
      role: {
        type: ENUM(Role.ADMIN, Role.USER, Role.INTEGRATION),
        defaultValue: Role.USER
      },
      profile: {
        type: VIRTUAL,
        get() {
          return {
            id: this.id,
            email: this.email,
            role: this.role
          };
        }
      },
      token: {
        type: STRING,
        unique: true
      },
      checkedCommentsAt: {
        type: DATE,
        field: 'checked_comments_at'
      },
      createdAt: {
        type: DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DATE,
        field: 'updated_at'
      },
      deletedAt: {
        type: DATE,
        field: 'deleted_at'
      }
    };
  }

  static associate({ Comment, Course, CourseUser }) {
    this.hasMany(Comment, {
      foreignKey: { name: 'authorId', field: 'author_id' }
    });
    this.belongsToMany(Course, {
      through: CourseUser,
      foreignKey: { name: 'userId', field: 'user_id' }
    });
  }

  static hooks() {
    return {
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
    };
  }

  static options() {
    return {
      modelName: 'user',
      underscored: true,
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  static invite(user, emailCb = noop) {
    return this.create(user)
      .then(user => {
        user.token = user.createToken({ expiresIn: '5 days' });
        mail.invite(user).asCallback(emailCb);
        return user.save();
      });
  }

  isAdmin() {
    return this.role === Role.ADMIN || this.role === Role.INTEGRATION;
  }

  authenticate(password) {
    if (!this.password) return Promise.resolve(false);
    return bcrypt
      .compare(password, this.password)
      .then(match => match ? this : false);
  }

  encrypt(val) {
    return bcrypt.hash(val, config.auth.saltRounds);
  }

  encryptPassword() {
    if (!this.password) return Promise.resolve(false);
    return this
      .encrypt(this.password)
      .then(pw => (this.password = pw));
  }

  createToken(options = {}) {
    const payload = { id: this.id, email: this.email };
    return jwt.sign(payload, AUTH_SECRET, options);
  }

  sendResetToken() {
    this.token = this.createToken({ expiresIn: '5 days' });
    mail.resetPassword(this);
    return this.save();
  }
}

module.exports = User;
