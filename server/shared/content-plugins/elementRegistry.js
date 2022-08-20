import BaseRegistry from './BaseRegistry.js';
import config from '../../../config/server/index.js';
import dedent from 'dedent';
import depd from 'depd';
import elementsList from '../../../config/shared/core-elements.js';
import hooks from './elementHooks.js';
import pick from 'lodash/pick';
import storage from '../../repository/storage.js';
import storageProxy from '../../repository/proxy.js';
import toCase from 'to-case';

const EXTENSIONS_LIST = '../../../extensions/content-elements/index.js';

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
    const services = { config, storage, storageProxy };
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

export default new ElementsRegistry();

function deprecateHandleStatics(element) {
  const name = `tce-${toCase.slug(element.type)}`;
  const hookTypes = Object.values(hooks).join(', ');
  depd(name)(dedent`
    Using legacy handleStatics method - please replace it with content element hooks: ${hookTypes}
  `);
}
