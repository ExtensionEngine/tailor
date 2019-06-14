'use strict';

const Audience = require('../shared/auth/audience');
const bcrypt = require('bcrypt');
const config = require('../../config/server');
const jwt = require('jsonwebtoken');
const mail = require('../shared/mail');
const { Model } = require('sequelize');
const Promise = require('bluebird');
const { user: Role } = require('../../config/shared').role;

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

  static hooks(Hooks) {
    return {
      [Hooks.beforeCreate](user) {
        return user.encryptPassword();
      },
      [Hooks.beforeUpdate](user) {
        return user.changed('password')
          ? user.encryptPassword()
          : Promise.resolve();
      },
      [Hooks.beforeBulkCreate](users) {
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
        const token = user.createToken({
          audience: Audience.Scope.Setup,
          expiresIn: '5 days'
        });
        mail.invite(user, token).asCallback(emailCb);
        return user;
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
    const { id, email } = this;
    const payload = { id, email };
    options.issuer = config.auth.issuer;
    options.audience = options.audience || Audience.Scope.Access;
    return jwt.sign(payload, this.getTokenSecret(options.audience), options);
  }

  sendResetToken() {
    const token = this.createToken({
      audience: Audience.Scope.Setup,
      expiresIn: '5 days'
    });
    mail.resetPassword(this, token);
  }

  getTokenSecret(audience) {
    const { secret } = config.auth;
    if (audience === Audience.Scope.Access) return secret;
    return `${secret}${this.password}${this.createdAt.getTime()}`;
  }
}

module.exports = User;
