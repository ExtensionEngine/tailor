const { run } = require('./shell');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const DEFAULT_LOGLEVEL = 'info';

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

  list({ verbose = false } = {}) {
    const options = { depth: 0, json: true, long: verbose };
    return this.run('list', options);
  }

  install(packages = [], { loglevel = DEFAULT_LOGLEVEL } = {}) {
    return this.run('install', packages, { loglevel });
  }

  remove(packages = [], { loglevel = DEFAULT_LOGLEVEL } = {}) {
    return this.run('remove', packages, { loglevel });
  }
}

module.exports = NpmClient;
