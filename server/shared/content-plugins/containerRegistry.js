'use strict';

const BaseRegistry = require('./BaseRegistry');
const containerList = require('../../../config/shared/core-containers');
const Promise = require('bluebird');

const EXTENSIONS_LIST = '../../../extensions/content-containers/index';

class ContainerRegistry extends BaseRegistry {
  constructor() {
    super('container', containerList, EXTENSIONS_LIST);
    this._staticsResolver = {};
    this._summaryBuilder = {};
  }

  async initialize() {
    await super.initialize();
    this.buildStaticResolver();
    this.buildSummaryBuilder();
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

  buildSummaryBuilder() {
    const { _registry: registry, _summaryBuilder: builder } = this;
    registry
      .forEach(it => Object.assign(builder, { [it.type]: it.buildSummary }));
  }

  getStaticsResolver(type) {
    return this._staticsResolver[type];
  }

  getSummaryBuilder(type) {
    return this._summaryBuilder[type];
  }
}

module.exports = new ContainerRegistry();
