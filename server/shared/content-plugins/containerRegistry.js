'use strict';

const BaseRegistry = require('./BaseRegistry');
const containerList = require('../../../config/shared/core-containers');
const Promise = require('bluebird');

const EXTENSIONS_LIST = '../../../extensions/content-containers/index';

class ContainerRegistry extends BaseRegistry {
  constructor() {
    super('container', containerList, EXTENSIONS_LIST);
    this._contentFetcher = {};
    this._staticsResolver = {};
    this._summaryBuilder = {};
  }

  async initialize() {
    await super.initialize();
    this.buildLookups();
  }

  fetch(types, ...attrs) {
    return Promise.reduce(this._registry, async (acc, container) => {
      if (!types.includes(container.type)) return acc;
      const data = await container.fetch(...attrs);
      return acc.concat(data);
    }, []);
  }

  buildLookups() {
    this._registry.forEach(it => {
      Object.assign(this._contentFetcher, { [it.type]: it.fetch });
      Object.assign(this._staticsResolver, { [it.type]: it.resolve });
      Object.assign(this._summaryBuilder, { [it.type]: it.buildSummary });
    });
  }

  getContentFetcher(type) {
    return this._contentFetcher[type];
  }

  getStaticsResolver(type) {
    return this._staticsResolver[type];
  }

  getSummaryBuilder(type) {
    return this._summaryBuilder[type];
  }
}

module.exports = new ContainerRegistry();
