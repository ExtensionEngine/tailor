const containerList = require('../../config/shared/custom-elements');
const Promise = require('bluebird');

const paths = {
  getCustom: path => `../../client/components/content-elements/${path}/util`,
  getExtension: path => `../../extensions/content-elements/${path}/util`
};

const EXTENSIONS_LIST = 'index';

class ContainerRegistry {
  constructor() {
    this._registry = [];
    this._staticsResolver = {};
  }

  async initialize() {
    await Promise.map(containerList, path => this.load(path));
    const extensions = await this.loadExtensionList();
    await Promise.map(extensions, path => this.load(path, true));
    this.buildStaticsResolver();
  }

  async load(path, isExtension) {
    const action = isExtension ? 'getExtension' : 'getCustom';
    try {
      this._registry.push(await require(paths[action](path)));
    } catch (_) {
      console.info(`${path} does not have a custom statics resolver.`);
    }
  }

  buildStaticsResolver() {
    const { _registry: registry, _staticsResolver: resolver } = this;
    registry
      .filter(it => it.resolveStatics)
      .forEach(it => Object.assign(resolver, { [it.type]: it.resolveStatics }));
  }

  getStaticsResolver(type) {
    return this._staticsResolver[type];
  }

  loadExtensionList() {
    const file = `../../extensions/content-elements/${EXTENSIONS_LIST}`;
    try {
      return require(file);
    } catch (_) {
      console.log('No element extensions loaded!');
      return [];
    }
  }
}

module.exports = new ContainerRegistry();
