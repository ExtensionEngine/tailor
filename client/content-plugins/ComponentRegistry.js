import {
  getToolbarName,
  isQuestion,
  processAnswerType
} from 'tce-core/utils';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import pick from 'lodash/pick';
import Promise from 'bluebird';

const EXTENSIONS_LIST = 'index';

export default class ComponentRegistry {
  constructor(Vue, type, extensions, attrs, getName) {
    this._registry = [];
    this.Vue = Vue;
    this._type = type;
    this._extensions = extensions;
    this._attrs = attrs;
    this._getName = getName;
  }

  async initialize() {
    await Promise.map(this._extensions, (path, index) => {
      return this.load(path, { position: index });
    });
    const extensions = await this.loadExtensionList();
    await Promise.map(extensions, (path, index) => {
      const position = this._extensions.length + index;
      return this.load(path, { position, isExtension: true });
    });
  }

  async load(path, options) {
    const { _registry, _type, _attrs, Vue } = this;
    const { position = _registry.length, isExtension } = options;
    const element = isExtension
      ? (await import(`extensions/content-${_type}s/${path}`)).default
      : (await import(`components/content-${_type}s/${path}`)).default;
    const type = isQuestion(element.type)
      ? processAnswerType(element.subtype)
      : element.type;
    const componentName = this._getName(type);
    _registry.push({ ...pick(element, _attrs), componentName, position });
    Vue.component(componentName, element.Edit);
    if (element.Toolbar) Vue.component(getToolbarName(type), element.Toolbar);
  }

  all() {
    return cloneDeep(this._registry);
  }

  get(type) {
    if (!type) return this.all();
    const { _registry: registry } = this;
    const res = find(registry, it => it.subtype === type || it.type === type);
    return res && cloneDeep(res);
  }

  loadExtensionList() {
    return import(`extensions/content-${this._type}s/${EXTENSIONS_LIST}`)
      .then(module => module.default)
      .catch(() => console.log(`No ${this._type} extensions loaded!`) || []);
  }
}
