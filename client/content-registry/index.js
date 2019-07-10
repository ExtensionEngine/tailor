import ContainerRegistry from './ContainerRegistry';
import ElementRegistry from './ElementRegistry';
import Promise from 'bluebird';

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
