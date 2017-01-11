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
    let out = isArray(data)
      ? data.map(obj => pickBy(obj, picker))
      : pickBy(data, picker);
    let responseData = { data: out };

    // Add pagination to the returning object
    const pagination = locals.load(req, 'pagination');
    if (pagination && isArray(out)) {
      const { page, limit } = pagination;
      const next = out.length < limit ? null : page + 1;
      const previous = page - 1;
      responseData.page = { next, previous };
    }

    res.json(responseData);
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
