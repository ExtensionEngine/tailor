const readConfig = require('./readConfig');

module.exports = function configLoader(name) {
  return function () {
    const config = readConfig(name);
    const isWebpack = !!arguments.length;
    if (!isWebpack) return config;
    return { code: createModule(config) };
  };
};

function createModule(obj) {
  return `module.exports = function() { return ${JSON.stringify(obj)}; };`;
}
