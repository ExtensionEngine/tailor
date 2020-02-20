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
      if (!types.includes(container.templateId)) return acc;
      const data = await container.fetch(...attrs);
      return acc.concat(data);
    }, []);
  }

  buildLookups() {
    this._registry.forEach(it => {
      Object.assign(this._contentFetcher, { [it.templateId]: it.fetch });
      Object.assign(this._staticsResolver, { [it.templateId]: it.resolve });
      Object.assign(this._summaryBuilder, { [it.templateId]: it.buildSummary });
    });
  }

  getContentFetcher(templateId) {
    return this._contentFetcher[templateId];
  }

  getStaticsResolver(templateId) {
    return this._staticsResolver[templateId];
  }

  getSummaryBuilder(templateId) {
    return this._summaryBuilder[templateId];
  }
}

module.exports = new ContainerRegistry();
