'use strict';

const BaseRegistry = require('./BaseRegistry');
const config = require('../../../config/server');
const dedent = require('dedent');
const depd = require('depd');
const elementsList = require('../../../config/shared/core-elements');
const getRepositoryStorage = require('../../repository/storage');
const hooks = require('./elementHooks');
const pick = require('lodash/pick');
const serviceProvider = require('../../shared/serviceProvider');
const toCase = require('to-case');

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
    const hookTypes = Object.values(hooks);
    this._registry.forEach(it => Object.assign(
      this._hooks,
      { [it.type]: pick(it, hookTypes) })
    );
  }

  getHook(type, hook) {
    const elementHooks = this._hooks[type];
    if (!elementHooks || !elementHooks[hook]) return;
    const storageProxy = serviceProvider.get('storageProxy');
    const storage = serviceProvider.get('storage');
    const services = { config, storageProxy, storage, getRepositoryStorage };
    return (element, options) => elementHooks[hook](element, services, options);
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
  const name = `tce-${toCase.slug(element.type)}`;
  const hookTypes = Object.values(hooks).join(', ');
  depd(name)(dedent`
    Using legacy handleStatics method - please replace it with content element hooks: ${hookTypes}
  `);
}
