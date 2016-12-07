'use strict';

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

function output() {
  return (req, res, next) => {
    const data = getData(res);
    res.json({ data });
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
