const path = require('path');
const rootPath = path.resolve(__dirname, '../../..');

function projectRoot(args = []) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [rootPath].concat(args));
}

module.exports = projectRoot;
