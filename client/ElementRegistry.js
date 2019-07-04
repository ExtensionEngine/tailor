import {
  getComponentName,
  getToolbarName,
  isQuestion,
  processAnswerType
} from 'tce-core/utils';
import cloneDeep from 'lodash/cloneDeep';
import elementList from './components/content-elements';
import extensionsList from '../extensions/content-elements';
import find from 'lodash/find';
import pick from 'lodash/pick';
import Promise from 'bluebird';

export default class ElementRegistry {
  constructor(Vue) {
    this._registry = [];
    this.Vue = Vue;
  }

  initialize() {
    const list = [...elementList, ...extensionsList];
    return Promise.map(list, (item, index) => this.load(item, index));
  }

  load(element, position = this._registry.length) {
    const { _registry, Vue } = this;
    const attrs = [
      'name', 'type', 'subtype', 'version', 'schema', 'initState', 'ui'
    ];
    const type = isQuestion(element.type)
      ? processAnswerType(element.subtype)
      : element.type;
    const componentName = getComponentName(type);
    _registry.push({ ...pick(element, attrs), componentName, position });
    Vue.component(componentName, element.Edit);
    if (element.Toolbar) Vue.component(getToolbarName(type), element.Toolbar);
  }

  all() {
    return cloneDeep(this._registry);
  }

  get(type) {
    if (!type) return this.all();
    const { _registry: registry } = this;
    const res = find(registry, { subtype: type }) || find(registry, { type });
    return res && cloneDeep(res);
  }
}
