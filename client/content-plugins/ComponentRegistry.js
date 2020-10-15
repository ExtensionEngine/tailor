import {
  getToolbarName,
  isQuestion,
  processAnswerType
} from 'tce-core/utils';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import kebabCase from 'lodash/kebabCase';
import noop from 'lodash/noop';
import pick from 'lodash/pick';
import Promise from 'bluebird';
import sortBy from 'lodash/sortBy';

const EXTENSIONS_LIST = 'index';

/**
 * This method is used to find the component that should be used for rendering
 * this element or container. If a templateId exists then use it. If not it tries
 * to find which type to use.
 */
function getIdentifier({ templateId, type, subtype }) {
  if (templateId) return templateId;
  return isQuestion(type) ? processAnswerType(subtype) : type;
}

export default class ComponentRegistry {
  constructor(Vue, { name, extensions, attrs, getName, getCondition, validator }) {
    this._registry = [];
    this.Vue = Vue;
    this._name = name;
    this._type = kebabCase(name);
    this._extensions = extensions;
    this._attrs = attrs;
    this._getName = getName;
    this._getCondition = getCondition;
    this._validator = validator || noop;
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
      ? (await import(`extensions/${_type}s/${path}`)).default
      : (await import(`components/${_type}s/${path}`)).default;
    this._validator(element);

    const id = getIdentifier(element);
    const componentName = this._getName(id);
    _registry.push({ ...pick(element, _attrs), componentName, position });
    Vue.component(componentName, element.Edit);
    if (element.Toolbar) Vue.component(getToolbarName(id), element.Toolbar);
  }

  get all() {
    return sortBy(cloneDeep(this._registry), 'position');
  }

  get(type) {
    if (!type) return null;
    const { _registry: registry } = this;
    const res = find(registry, this._getCondition(type));
    return res && cloneDeep(res);
  }

  loadExtensionList() {
    return import(`extensions/${this._type}s/${EXTENSIONS_LIST}`)
      .then(module => module.default)
      .catch(() => console.log(`No ${this._name} extensions loaded!`) || []);
  }
}
