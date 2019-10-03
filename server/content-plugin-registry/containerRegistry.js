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

  fetch(...attrs) {
    return Promise.reduce(this._registry, async (acc, container) => {
      const { publishedAs } = container;
      const data = await container.fetch(...attrs);
      return acc.concat(data.map(it => ({ ...it, publishedAs })));
    }, []);
  }

  buildStaticResolver() {
    const { _registry: registry, _staticsResolver: resolver } = this;
    registry
      .filter(it => it.resolve)
      .forEach(it => Object.assign(resolver, { [it.publishedAs]: it.resolve }));
  }

  resolveStatics(container, defaultResolver) {
    const resolver = this._staticsResolver[container.publishedAs];
    return resolver(container, defaultResolver);
  }
}

module.exports = new ContainerRegistry();
