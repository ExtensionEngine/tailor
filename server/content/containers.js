const containerList = require('../../config/shared/custom-containers');
const find = require('lodash/find');
const Promise = require('bluebird');

const paths = {
  getCustom: path => `../../client/components/content-containers/${path}/util`,
  getExtension: path => `../../extensions/content-containers/${path}/util`
};

const EXTENSIONS_LIST = 'index';

class ContainerRegistry {
  constructor() {
    this._registry = [];
  }

  async initialize() {
    await Promise.map(containerList, path => this.load(path));
    const extensions = await this.loadExtensionList();
    await Promise.map(extensions, path => this.load(path, true));
  }

  async load(path, isExtension) {
    const action = isExtension ? 'getExtension' : 'getCustom';
    const container = await require(paths[action](path));
    this._registry.push(container);
  }

  fetch(attrs) {
    return Promise.map(this._registry, async container => {
      const data = await container.fetch(...attrs);
      return { data, publishedAs: container.publishedAs };
    });
  }

  getStaticsResolver(publishedAs) {
    const container = find(this._registry, { publishedAs });
    return container.resolve;
  }

  loadExtensionList() {
    const file = `../../extensions/content-containers/${EXTENSIONS_LIST}`;
    try {
      return require(file);
    } catch (_) {
      console.log('No container extensions loaded!');
      return [];
    }
  }
}

module.exports = new ContainerRegistry();
