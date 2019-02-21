'use strict';

const { Sequelize, Op } = require('sequelize');
const has = require('lodash/has');
const inRange = require('lodash/inRange');
const last = require('lodash/last');

// eslint-disable-next-line no-extra-parens
const AsyncFunction = (async function () {}).constructor;

const isAsyncFunction = arg => arg instanceof AsyncFunction;
const notEmpty = input => input.length > 0;

const sql = {
  concat,
  where
};

module.exports = {
  sql,
  getValidator,
  setLogging,
  wrapAsyncMethods
};

function wrapAsyncMethods(Model, wrapper = require('bluebird').method) {
  const transformer = ({ value }) => isAsyncFunction(value) && wrapper(value);
  transformProperties(Model, transformer);
  transformProperties(Model.prototype, transformer);
  return Model;
}

function getValidator(Model, attribute) {
  return function validate(input) {
    const validator = Model.prototype.validators[attribute];
    if (!validator || !validator.len) {
      return notEmpty(input) || `"${attribute}" can not be empty`;
    }
    const [min, max] = validator.len;
    return inRange(input.length, min, max) ||
      `"${attribute}" must be between ${min} and ${max} characters long`;
  };
}

function setLogging(Model, state) {
  const { options } = Model.sequelize;
  options.logging = state;
  return options.logging;
}

function concat(...args) {
  const options = has(last(args), 'separator') ? args.pop() : {};
  if (!options.separator) return Sequelize.fn('concat', ...args);
  return Sequelize.fn('concat_ws', options.separator, ...args);
}

// NOTE: Fixes https://github.com/sequelize/sequelize/issues/6440
function where(attribute, logic, options = {}) {
  const { comparator = '=', scope = false } = options;
  const where = Sequelize.where(attribute, comparator, logic);
  return !scope ? where : { [Op.and]: [where] };
}

function transformProperties(obj, cb) {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  Object.keys(descriptors).forEach(name => {
    const val = cb(descriptors[name], name);
    if (val) obj[name] = val;
  });
}
