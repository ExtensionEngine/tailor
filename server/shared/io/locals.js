'use strict';

const get = require('lodash/get');
const set = require('lodash/set');
const merge = require('lodash/merge');
const isPlainObject = require('lodash/isPlainObject');

function load(obj, path) {
  return get(obj, `locals.${path}`);
}

function save(obj, path, value) {
  if (!obj.locals) obj.locals = {};
  const target = get(obj, `locals.${path}`);
  if (isPlainObject(target) && isPlainObject(value)) return merge(target, value);
  return set(obj, `locals.${path}`, value);
}

module.exports = {
  load,
  save
};
