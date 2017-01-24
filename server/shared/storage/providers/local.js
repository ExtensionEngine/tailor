// TODO(marko): Fallback class for local development
class Local {
  constructor(options = {}) {
    this.options = options;
  }

  loadFile(key, location, options) {
  }

  saveFile(file, options) {
  }

  deleteFile(key, options) {
  }

  listFiles(options) {
  }

  getFileUrl(key, options) {
  }

  fileExists(key, options) {
  }
}

module.exports = {
  provider: Local
};
