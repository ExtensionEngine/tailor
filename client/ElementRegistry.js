import {
  getComponentName,
  getToolbarName,
  processAssessmentType
} from 'tce-core/utils';
import pick from 'lodash/pick';

export default class ElementRegistry {
  constructor(Vue) {
    this.Vue = Vue;
    this._registry = [];
  }

  async load(moduleName) {
    const { _registry, Vue } = this;
    const element = (await import(`../content-elements/${moduleName}`)).default;
    const attrs = ['type', 'subtype', 'version', 'schema', 'initState'];
    const isAssessment = element.type === 'ASSESSMENT';
    const type = isAssessment
      ? processAssessmentType(element.subtype)
      : element.type;
    const componentName = getComponentName(type);
    _registry.push({ ...pick(element, attrs), componentName });
    Vue.component(componentName, element.Edit);
    if (element.Toolbar) Vue.component(getToolbarName(type), element.Toolbar);
  }
}
