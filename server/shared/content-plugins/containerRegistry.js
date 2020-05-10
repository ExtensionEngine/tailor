'use strict';

const BaseRegistry = require('./BaseRegistry');
const containerList = require('../../../config/shared/core-containers');

const EXTENSIONS_LIST = '../../../extensions/content-containers/index';

class ContainerRegistry extends BaseRegistry {
  constructor() {
    super('container', containerList, EXTENSIONS_LIST);
    this._publishStructureBuilder = {};
    this._staticsResolver = {};
    this._summaryBuilder = {};
  }

  async initialize() {
    await super.initialize();
    this.buildLookups();
  }

  buildLookups() {
    this._registry.forEach(it => {
      Object.assign(this._publishStructureBuilder, { [it.templateId]: it.fetch });
      Object.assign(this._staticsResolver, { [it.templateId]: it.resolve });
      Object.assign(this._summaryBuilder, { [it.templateId]: it.buildSummary });
    });
  }

  getPublishStructureBuilder(templateId) {
    return this._publishStructureBuilder[templateId];
  }

  getStaticsResolver(templateId) {
    return this._staticsResolver[templateId];
  }

  getSummaryBuilder(templateId) {
    return this._summaryBuilder[templateId];
  }
}

module.exports = new ContainerRegistry();
