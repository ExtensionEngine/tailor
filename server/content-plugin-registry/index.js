const containerRegistry = require('./containerRegistry');
const elementRegistry = require('./elementRegistry');
const Promise = require('bluebird');

class ContentPluginRegistry {
  constructor() {
    this.containerRegistry = containerRegistry;
    this.elementRegistry = elementRegistry;
  }

  initialize() {
    const registires = Object.values(this);
    return Promise.map(registires, it => it.initialize());
  }
}

module.exports = new ContentPluginRegistry();
