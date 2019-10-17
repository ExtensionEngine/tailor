'use strict';

const BaseRegistry = require('./BaseRegistry');
const containerList = require('../../../config/shared/core-containers');
const Promise = require('bluebird');

const EXTENSIONS_LIST = '../../../extensions/content-containers/index';

class ContainerRegistry extends BaseRegistry {
  constructor() {
    super('container', containerList, EXTENSIONS_LIST);
    this._staticsResolver = {};
  }

  async initialize() {
    await super.initialize();
    this.buildStaticResolver();
  }

  fetch(...attrs) {
    return Promise.reduce(this._registry, async (acc, container) => {
      const data = await container.fetch(...attrs);
      return acc.concat(data);
    }, []);
  }

  buildStaticResolver() {
    const { _registry: registry, _staticsResolver: resolver } = this;
    registry
      .forEach(it => Object.assign(resolver, { [it.type]: it.resolve }));
  }

  getStaticsResolver(type) {
    return this._staticsResolver[type];
  }
}

module.exports = new ContainerRegistry();
