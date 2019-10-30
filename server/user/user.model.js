'use strict';

const Audience = require('../shared/auth/audience');
const bcrypt = require('bcrypt');
const config = require('../../config/server');
const jwt = require('jsonwebtoken');
const mail = require('../shared/mail');
const map = require('lodash/map');
const { Model } = require('sequelize');
const pick = require('lodash/pick');
const Promise = require('bluebird');
const { role: roles } = require('../../config/shared');

const { user: { ADMIN, USER, INTEGRATION } } = roles;
const randomPassword = () =>
  Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

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
        validate: { notEmpty: true, len: [5, 100] },
        defaultValue: randomPassword
      },
      role: {
        type: ENUM(ADMIN, USER, INTEGRATION),
        defaultValue: USER
      },
      profile: {
        type: VIRTUAL,
        get() {
          return pick(this,
            ['id', 'email', 'role', 'createdAt', 'updatedAt', 'deletedAt']);
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
        const updates = [];
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

  static invite(user) {
    return this.create(user)
      .then(user => this.sendInvitation(user));
  }

  static inviteOrUpdate(data) {
    const { email } = data;
    return User.findOne({ where: { email }, paranoid: false }).then(user => {
      if (!user) return User.invite(data);
      map(({ ...data, deletedAt: null }), (v, k) => user.setDataValue(k, v));
      return user.save();
    });
  }

  static sendInvitation(user) {
    const token = user.createToken({
      expiresIn: '5 days',
      audience: Audience.Scope.Setup
    });
    mail.invite(user, token);
  }

  isAdmin() {
    return this.role === ADMIN || this.role === INTEGRATION;
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
    Object.assign(options, {
      issuer: config.auth.issuer,
      audience: options.audience || Audience.Scope.Access
    });
    return jwt.sign(payload, this.getTokenSecret(options.audience), options);
  }

  sendResetToken() {
    const token = this.createToken({
      audience: Audience.Scope.Setup,
      expiresIn: '2 days'
    });
    mail.resetPassword(this, token);
  }

  getTokenSecret(audience) {
    const { secret } = config.auth;
    if (audience === Audience.Scope.Access) return secret;
    return [secret, this.password, this.createdAt.getTime()].join('');
  }
}

module.exports = User;
