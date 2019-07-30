'use strict';

const config = require('../../config/server');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const mail = require('../shared/mail');
const map = require('lodash/map');
const { Model } = require('sequelize');
const pick = require('lodash/pick');
const Promise = require('bluebird');
const { role: roles } = require('../../config/shared');

const { user: { ADMIN, USER, INTEGRATION } } = roles;

const AUTH_SECRET = process.env.AUTH_JWT_SECRET;
const bcrypt = Promise.promisifyAll(require('bcryptjs'));
const noop = Function.prototype;

const gravatarConfig = { size: 130, default: 'mp' };

class User extends Model {
  static fields({ DATE, ENUM, STRING, TEXT, VIRTUAL }) {
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
        type: ENUM(ADMIN, USER, INTEGRATION),
        defaultValue: USER
      },
      firstName: {
        type: STRING,
        defaultValue: '',
        field: 'first_name'
      },
      lastName: {
        type: STRING,
        defaultValue: '',
        field: 'last_name'
      },
      imgUrl: {
        type: TEXT,
        field: 'img_url',
        defaultValue: ''
      },
      profile: {
        type: VIRTUAL,
        get() {
          return pick(this, [
            'id', 'email', 'role', 'firstName', 'lastName',
            'imgUrl', 'createdAt', 'updatedAt', 'deletedAt'
          ]);
        }
      },
      token: {
        type: STRING,
        unique: true
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
      [Hooks.beforeCreate]: onUpsert,
      [Hooks.beforeUpdate]: onUpsert,
      [Hooks.beforeBulkCreate](users) {
        let updates = [];
        users.forEach(user => updates.push(user.encryptPassword()));
        return Promise.all(updates);
      }
    };

    function onUpsert(user) {
      return user
        .setGravatar()
        .encryptPassword();
    }
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
      .then(user => this.sendInvitation(user, emailCb));
  }

  static inviteOrUpdate(data) {
    const { email } = data;
    return User.findOne({ where: { email }, paranoid: false }).then(user => {
      if (!user) return User.invite(data);
      map(({ ...data, deletedAt: null }), (v, k) => user.setDataValue(k, v));
      return user.save();
    });
  }

  static sendInvitation(user, emailCb = noop) {
    user.token = user.createToken({ expiresIn: '5 days' });
    mail.invite(user).asCallback(emailCb);
    return user.save();
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
    if (!this.changed('password') || !this.password) return Promise.resolve(false);
    return this.encrypt(this.password)
      .then(password => (this.password = password));
  }

  setGravatar() {
    if (!this.changed('email')) return this;
    this.imgUrl = gravatar.url(this.email, gravatarConfig, true /* https */);
    return this;
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
