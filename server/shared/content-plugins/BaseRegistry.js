import Promise from 'bluebird';

const PATHS = {
  DEFAULT: '../../../client/components',
  EXTENSION: '../../../extensions'
};

export default class {
  constructor(type, extensions, basePath) {
    this._registry = [];
    this._type = type;
    this._extensions = extensions;
    this._basePath = basePath;
  }

  async initialize() {
    await Promise.map(this._extensions, path => this.load(path));
    const extensions = await this.loadExtensionList();
    await Promise.map(extensions, path => this.load(path, true));
  }

  async load(path, isExtension) {
    try {
      this._registry.push(await import(this.getFullPath(path, isExtension)));
    } catch (err) {
      console.info(`${path} does not have a custom statics method.`);
    }
  }

  getFullPath(path, isExtension) {
    const basePath = isExtension ? PATHS.EXTENSION : PATHS.DEFAULT;
    return `${basePath}/content-${this._type}s/${path}/server`;
  }

  loadExtensionList() {
    try {
      return import(this._basePath);
    } catch (err) {
      console.log(`No ${this._type} extensions loaded!`);
      return [];
    }
  }
}
