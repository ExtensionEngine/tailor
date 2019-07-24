import containerList from 'shared/custom-containers';
import { getContainerName } from 'tce-core/utils';
import pick from 'lodash/pick';
import Promise from 'bluebird';

const EXTENSIONS_LIST = 'index';

export default class ContainerRegistry {
  constructor(Vue) {
    this._registry = [];
    this.Vue = Vue;
  }

  async initialize() {
    await Promise.map(containerList, (path, index) => {
      return this.load(path, { position: index });
    });
    const extensions = await this.loadExtensionList();
    await Promise.map(extensions, (path, index) => {
      const position = containerList.length + index;
      return this.load(path, { position, isExtension: true });
    });
  }

  async load(path, options) {
    const { _registry, Vue } = this;
    const { position = _registry.length, isExtension } = options;
    const container = isExtension
      ? (await import(`extensions/content-containers/${path}`)).default
      : (await import(`components/content-containers/${path}`)).default;
    const attrs = ['type', 'version'];
    const contanerName = getContainerName(container.type);
    _registry.push({ ...pick(container, attrs), contanerName, position });
    Vue.component(contanerName, container.Edit);
  }

  loadExtensionList() {
    return import(`extensions/content-containers/${EXTENSIONS_LIST}`)
      .then(module => module.default)
      .catch(() => console.log('No container extensions loaded!') || []);
  }
}
