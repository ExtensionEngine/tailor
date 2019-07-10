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
    const extensions = await this.loadExtensionList();
    return Promise
      .map(extensions, (location, index) => this.load(location, index));
  }

  async load(location, position) {
    const { _registry, Vue } = this;
    const element = (await import(`../../extensions/content-containers/${location}`)).default;
    const attrs = ['type', 'version'];
    const contanerName = getContainerName(element.type);
    _registry.push({ ...pick(element, attrs), contanerName, position });
    Vue.component(contanerName, element.Edit);
  }

  loadExtensionList() {
    return import(`../../extensions/content-containers/${EXTENSIONS_LIST}`)
      .then(module => module.default)
      .catch(() => console.log('No container extensions loaded!') || []);
  }
}
