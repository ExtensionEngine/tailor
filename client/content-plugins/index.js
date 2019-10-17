import ContainerRegistry from './ContainerRegistry';
import ElementRegistry from './ElementRegistry';

export default class ContentRepository {
  constructor(Vue) {
    this.containerRegistry = new ContainerRegistry(Vue);
    this.elementRegistry = new ElementRegistry(Vue);
  }

  initialize() {
    return Promise.all([
      this.containerRegistry.initialize(),
      this.elementRegistry.initialize()
    ]);
  }
}
