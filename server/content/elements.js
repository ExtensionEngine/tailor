const elementsList = require('../../config/shared/custom-elements');
const Promise = require('bluebird');

const paths = {
  getCustom: path => `../../client/components/content-elements/${path}/util`,
  getExtension: path => `../../extensions/content-elements/${path}/util`
};

const EXTENSIONS_LIST = 'index';

class ElementsRegistry {
  constructor() {
    this._registry = [];
    this._staticsHandler = {};
  }

  async initialize() {
    await Promise.map(elementsList, path => this.load(path));
    const extensions = await this.loadExtensionList();
    await Promise.map(extensions, path => this.load(path, true));
    this.buildStaticsHandler();
  }

  async load(path, isExtension) {
    const action = isExtension ? 'getExtension' : 'getCustom';
    try {
      this._registry.push(await require(paths[action](path)));
    } catch (_) {
      console.info(`${path} does not have a custom statics handling.`);
    }
  }

  buildStaticsHandler() {
    const { _registry: registry, _staticsHandler: handler } = this;
    registry
      .filter(it => it.handleStatics)
      .forEach(it => Object.assign(handler, { [it.type]: it.handleStatics }));
  }

  getStaticsHandler(type) {
    return this._staticsHandler[type];
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

module.exports = new ElementsRegistry();
