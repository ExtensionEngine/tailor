'use strict';

const BaseRegistry = require('./BaseRegistry');
const elementsList = require('../../../config/shared/core-elements');

const EXTENSIONS_LIST = '../../../extensions/content-elements/index';

class ElementsRegistry extends BaseRegistry {
  constructor() {
    super('element', elementsList, EXTENSIONS_LIST);
    this._staticsHandler = {};
  }

  async initialize() {
    await super.initialize();
    this.buildStaticsHandler();
  }

  buildStaticsHandler() {
    const { _registry: registry, _staticsHandler: handler } = this;
    registry
      .filter(it => it.handleStatics)
      .forEach(it => Object.assign(handler, { [it.type]: it.handleStatics }));
  }

  getStaticsHandler(type) {
    const handler = this._staticsHandler[type];
    if (!handler) return;
    return (...args) => Promise.resolve(handler(...args));
  }
}

module.exports = new ElementsRegistry();
