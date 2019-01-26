import {
  getComponentName,
  getToolbarName,
  processAssessmentType
} from 'tce-core/utils';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import pick from 'lodash/pick';

export default class ElementRegistry {
  constructor(Vue) {
    this.Vue = Vue;
    this._registry = [];
  }

  async load(moduleName) {
    const { _registry, Vue } = this;
    const element = (await import(`../content-elements/${moduleName}`)).default;
    const attrs = [
      'name', 'type', 'subtype', 'version', 'schema', 'initState', 'ui'
    ];
    const isAssessment = element.type === 'ASSESSMENT';
    const type = isAssessment
      ? processAssessmentType(element.subtype)
      : element.type;
    const componentName = getComponentName(type);
    _registry.push({ ...pick(element, attrs), componentName });
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
