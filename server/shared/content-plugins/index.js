'use strict';

const containerRegistry = require('./containerRegistry');
const elementRegistry = require('./elementRegistry');
const Promise = require('bluebird');

class ContentPluginRegistry {
  constructor() {
    this.containerRegistry = containerRegistry;
    this.elementRegistry = elementRegistry;
  }

  initialize() {
    const registries = Object.values(this);
    return Promise.map(registries, it => it.initialize());
  }
}

module.exports = new ContentPluginRegistry();
