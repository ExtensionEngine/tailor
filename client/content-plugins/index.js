import ContainerRegistry from './ContainerRegistry';
import ElementRegistry from './ElementRegistry';
import MetaRegistry from './MetaRegistry';

export default class ContentRepository {
  constructor(Vue) {
    this.containerRegistry = ContainerRegistry(Vue);
    this.elementRegistry = ElementRegistry(Vue);
    this.metaRegistry = MetaRegistry(Vue);
  }

  initialize() {
    return Promise.all([
      this.containerRegistry.initialize(),
      this.elementRegistry.initialize(),
      this.metaRegistry.initialize()
    ]);
  }
}
