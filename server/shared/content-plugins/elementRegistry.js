'use strict';

const BaseRegistry = require('./BaseRegistry');
const config = require('../../../config/server');
const dedent = require('dedent');
const depd = require('depd');
const elementsList = require('../../../config/shared/core-elements');
const hooks = require('./elementHooks');
const pick = require('lodash/pick');
const storage = require('../storage');
const storageProxy = require('../storage/proxy');

const EXTENSIONS_LIST = '../../../extensions/content-elements/index';

class ElementsRegistry extends BaseRegistry {
  constructor() {
    super('element', elementsList, EXTENSIONS_LIST);
    this._staticsHandler = {};
    this._hooks = {};
  }

  async initialize() {
    await super.initialize();
    this.buildStaticsHandler();
    this.registerHooks();
  }

  registerHooks() {
    const { _registry: registry } = this;
    const hookTypes = Object.values(hooks);
    registry.forEach(it => Object.assign(
      this._hooks,
      { [it.type]: pick(it, hookTypes) })
    );
  }

  getHook(type, hook) {
    const elementHooks = this._hooks[type];
    if (!elementHooks || !elementHooks[hook]) return;
    const services = { config, storage, storageProxy };
    return element => elementHooks[hook](element, services);
  }

  buildStaticsHandler() {
    const { _registry: registry, _staticsHandler: handler } = this;
    registry
      .filter(it => it.handleStatics)
      .forEach(it => {
        deprecateHandleStatics(it);
        Object.assign(handler, { [it.type]: it.handleStatics });
      });
  }

  getStaticsHandler(type) {
    const handler = this._staticsHandler[type];
    if (!handler) return;
    return (...args) => Promise.resolve(handler(...args));
  }
}

module.exports = new ElementsRegistry();

function deprecateHandleStatics(element) {
  const name = `tce-${element.type.toLowerCase()}`;
  const hookTypes = Object.values(hooks).join(', ');
  depd(name)(dedent`
    Using legacy handleStatics method - please replace it with content element hooks: ${hookTypes}
  `);
}
