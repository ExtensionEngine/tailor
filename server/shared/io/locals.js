'use strict';

const _ = require('lodash');

function load(obj, path) {
  return _.get(obj, `locals.${path}`);
}

function save(obj, path, value) {
  if (!obj.locals) obj.locals = {};
  const target = _.get(obj, `locals.${path}`);
  if (_.isPlainObject(target) && _.isPlainObject(value)) return _.merge(target, value);
  return _.set(obj, `locals.${path}`, value);
}

module.exports = {
  load,
  save
};
