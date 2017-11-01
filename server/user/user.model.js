const { user: role } = require('../../config/shared').role;
const config = require('../../config/server');
const jwt = require('jsonwebtoken');
const mail = require('../shared/mail');
const Promise = require('bluebird');

const bcrypt = Promise.promisifyAll(require('bcryptjs'));
const AUTH_SECRET = process.env.AUTH_JWT_SECRET;

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
      type: DataTypes.ENUM(role.ADMIN, role.USER, role.INTEGRATION),
      defaultValue: role.USER
    },
    token: {
      type: DataTypes.STRING,
      unique: true
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
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
        User.belongsToMany(models.Course, {
          through: models.CourseUser,
          foreignKey: { name: 'userId', field: 'user_id' }
        });
      },
      invite(user) {
        return User.create(user).then(user => {
          user.token = user.createToken({ expiresIn: '5 days' });
          mail.invite(user);
          return user.save();
        });
      }
    },
    instanceMethods: {
      isAdmin() {
        return this.role === role.ADMIN || this.role === role.INTEGRATION;
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
      createToken(options = {}) {
        const payload = { id: this.id, email: this.email };
        return jwt.sign(payload, AUTH_SECRET, options);
      },
      sendResetToken() {
        this.token = this.createToken({ expiresIn: '5 days' });
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
    underscored: true,
    timestamps: true,
    paranoid: true,
    freezeTableName: true
  });

  return User;
};
