const { run } = require('./shell');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

class NpmClient {
  constructor(options = {}) {
    this.path = options.path;
  }

  run(command, args, options) {
    if (arguments.length <= 2) {
      options = args;
      args = [];
    }
    args = args || [];
    options = Object.assign({}, options, { cwd: this.path });
    return run(npm, command, args, options);
  }

  list() {
    const options = { depth: 0, json: true, long: true };
    return this.run('list', options);
  }

  install(packages = []) {
    return this.run('install', packages, {});
  }

  remove(packages = []) {
    return this.run('remove', packages, {});
  }

  prune() {
    return this.run('prune');
  }
}

module.exports = NpmClient;
