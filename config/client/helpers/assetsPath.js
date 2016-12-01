const path = require('path');
const envSettings = require('./envSettings');

function getAssetsPath(_path) {
  const assetsSubDirectory = process.env.NODE_ENV === envSettings.prod.env.NODE_ENV
    ? envSettings.prod.assetsSubDirectory
    : envSettings.dev.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path);
}

module.exports = getAssetsPath;
