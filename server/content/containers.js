const BaseRegistry = require('./BaseRegistry');
const containerList = require('../../config/shared/custom-containers');
const Promise = require('bluebird');

const EXTENSIONS_LIST = `../../extensions/content-containers/index`;

class ContainerRegistry extends BaseRegistry {
  constructor() {
    super('container', containerList, EXTENSIONS_LIST);
    this._staticsResolver = {};
  }

  async initialize() {
    await super.initialize();
    this.buildStaticResolver();
  }

  fetch(attrs) {
    return Promise.map(this._registry, async container => {
      const data = await container.fetch(...attrs);
      return { data, publishedAs: container.publishedAs };
    });
  }

  buildStaticResolver() {
    const { _registry: registry, _staticsResolver: resolver } = this;
    registry
      .filter(it => it.resolve)
      .forEach(it => Object.assign(resolver, { [it.publishedAs]: it.resolve }));
  }

  getStaticsResolver(publishedAs) {
    return this._staticsResolver[publishedAs];
  }
}

module.exports = new ContainerRegistry();
