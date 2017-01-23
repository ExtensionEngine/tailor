// Fallback class for local development
class Local {
  constructor(options = {}) {
    this.options = options;
  }

  listFiles(options) {
  }

  getFile(options) {
  }

  saveFile(file, options) {
  }

  deleteFile(options) {
  }

  getFileUrl(options) {
  }

  fileExists(options) {
  }
}

module.exports = {
  provider: Local
};
