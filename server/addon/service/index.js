const config = require('../../../config/server');
const expandPath = require('untildify');
const logger = require('../../shared/logger');
const logstream = require('./logstream');
const npa = require('npm-package-arg')
const NpmClient = require('./npm');
const path = require('path');
const pluralize = require('pluralize');
const Promise = require('bluebird');
const PromiseQueue = require('promise-queue');
const task = require('./task');

const fs = Promise.promisifyAll(require('fs'));
const resolvePath = str => path.resolve(expandPath(str));
const jsonify = obj => JSON.stringify(obj, null, 2);

const template = jsonify({
  '//NOTE': 'Do NOT remove this file!',
  name: 'tailor-addons',
  private: true
});

class AddonService {
  constructor(options = {}) {
    const path = resolvePath(options.modulesPath);
    this.packageManager = new NpmClient({ path });
    this.queue = new PromiseQueue(1, Infinity);
    this.queue.add(() => createPackagefile(path, template));
  }

  list(options = {}) {
    const list = task(() => this.packageManager.list(options));
    this.queue.add(() => list.run());
    return list.getProcess()
      .then(proc => proc.promise())
      .then(({ stdout }) => JSON.parse(stdout));
  }

  install(packages = [], options = {}) {
    packages = sanitize(packages);
    const count = packages.length;
    const install = task(() => this.packageManager.install(packages, options));
    logger.info(`[PackageManager] installing ${count} ${pluralize('package', count)}:`, packages);
    this.queue.add(() => install.run());
    return install.getProcess()
      .then(proc => Object.assign(proc, { jsonl: logstream(proc) }));
  }

  remove(packages = [], options = {}) {
    packages = sanitize(packages);
    const count = packages.length;
    const uninstall = task(() => this.packageManager.remove(packages, options));
    logger.info(`[PackageManager] uninstalling ${count} ${pluralize('package', count)}:`, packages);
    this.queue.add(() => uninstall.run());
    return uninstall.getProcess()
      .then(proc => Object.assign(proc, { jsonl: logstream(proc) }));
  }
}

module.exports = new AddonService({ modulesPath: config.modulesPath });

function createPackagefile(dest, contents) {
  const file = path.join(dest, '/package.json');
  return fs.openAsync(file, 'wx')
    .then(fd => fs.writeAsync(fd, Buffer.from(contents)))
    .catch(err => (err.code !== 'EEXIST') ? Promise.reject(err) : true);
}

function sanitize(packages = []) {
  return packages.reduce((acc, it) => {
    const [err, desc] = parsePkgDesc(it);
    if (err) return acc;
    acc.push(desc.raw);
    return acc;
  }, []);
}

function parsePkgDesc(str) {
  try {
    return [null, npa(str)];
  } catch (err) {
    return [err];
  }
}
