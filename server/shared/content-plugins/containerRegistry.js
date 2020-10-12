'use strict';

const BaseRegistry = require('./BaseRegistry');
const containerList = require('../../../config/shared/core-containers');

const EXTENSIONS_LIST = '../../../extensions/content-containers/index';

const getId = it => it.templateId || it.type;

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
      const id = getId(it);

      Object.assign(this._publishStructureBuilder, { [id]: it.fetch });
      Object.assign(this._staticsResolver, { [id]: it.resolve });
      Object.assign(this._summaryBuilder, { [id]: it.buildSummary });
    });
  }

  getPublishStructureBuilder(container) {
    return this._publishStructureBuilder[getId(container)];
  }

  getStaticsResolver(container) {
    return this._staticsResolver[getId(container)];
  }

  getSummaryBuilder(container) {
    return this._summaryBuilder[getId(container)];
  }
}

module.exports = new ContainerRegistry();
