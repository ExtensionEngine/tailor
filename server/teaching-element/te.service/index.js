const config = require('../../../config/server');
const expandPath = require('untildify');
const NpmClient = require('./npm');
const path = require('path');
const Promise = require('bluebird');
const PromiseQueue = require('promise-queue');

const fs = Promise.promisifyAll(require('fs'));
const resolvePath = str => path.resolve(expandPath(str));

const template = JSON.stringify({
  '//NOTE': 'Do NOT remove this file!',
  private: true
});

class TeachingElementService {
  constructor(options = {}) {
    const path = resolvePath(options.modulesPath);
    this.packageManager = new NpmClient({ path });
    this.queue = new PromiseQueue(1, Infinity);
    this.queue.add(() => createPackagefile(path, template));
  }

  list() {
    return this.queue.add(() => this.packageManager.list())
      .then(proc => proc.promise())
      .then(({ stdout }) => JSON.parse(stdout));
  }

  install(packages = []) {
    return this.queue.add(() => this.packageManager.install(packages));
  }

  remove(packages = []) {
    return this.queue.add(() => this.packageManager.remove(packages));
  }

  prune() {
    return this.queue.add(() => this.packageManager.prune());
  }
}

module.exports = new TeachingElementService({ modulesPath: config.modulesPath });

function createPackagefile(dest, contents) {
  const file = path.join(dest, '/package.json');
  return fs.openAsync(file, 'wx')
    .then(fd => fs.writeAsync(fd, Buffer.from(contents)))
    .catch(err => (err.code !== 'EEXIST') ? Promise.reject(err) : true);
}
