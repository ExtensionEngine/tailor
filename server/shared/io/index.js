'use strict';

const isArray = require('lodash/isArray');
const pickBy = require('lodash/pickBy');
const locals = require('./locals');
const response = require('./response');
const getData = response.getData;

function input() {
  return (req, res, next) => {
    // Make it easier to build Location header:
    res.originalUrl = req.originalUrl;
    // TODO(matej): validate headers (accept, content-type)
    next();
  };
}

function output(config = {
  propsToRemove: ['_id', '_rev', 'password']
}) {
  const propsToRemove = new Set(config.propsToRemove);
  const picker = (value, key) => !propsToRemove.has(key);

  return (req, res, next) => {
    const data = getData(res);

    // Remove sensitive or database-specific properties:
    const out = isArray(data)
      ? data.map(obj => pickBy(obj, picker))
      : pickBy(data, picker);

    res.json({ data: out });
  };
}

module.exports = {
  input,
  locals,
  output,
  setOK: response.setOK,
  setCreated: response.setCreated,
  setEmpty: response.setEmpty,
  getData: response.getData
};
