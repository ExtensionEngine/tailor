'use strict';

const isFunction = require('lodash/isFunction');

function serviceProvider() {
  const services = {};

  const get = (key, ...params) => {
    const service = services[key];
    if (isFunction(service)) return service(...params);
    return service;
  };
  const set = (key, service) => {
    services[key] = service;
  };

  return { get, set };
}

module.exports = serviceProvider();
