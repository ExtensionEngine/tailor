'use strict';

const { save, load } = require('./locals');

const IO_DATA_PATH = 'io.data';

function setOK(response, data) {
  if (data) save(response, IO_DATA_PATH, data);
  response.status(200);
}

function setCreated(response, resource) {
  save(response, IO_DATA_PATH, resource);
  response.location(`${response.originalUrl}/${resource._key}`);
  response.status(201);
}

function setEmpty(response) {
  save(response, IO_DATA_PATH, undefined);
  response.status(204);
}

function getData(response) {
  return load(response, IO_DATA_PATH);
}

module.exports = {
  setOK,
  setCreated,
  setEmpty,
  getData
};
