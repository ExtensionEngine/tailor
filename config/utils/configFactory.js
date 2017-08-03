const readConfig = require('./readConfig');

module.exports = function configFactory(name) {
  return () => {
    const isWebpack = !!arguments.length;
    const config = readConfig(name);
    if (!isWebpack) return config;
    return { code: createModule(config) };
  };
};

function createModule(obj) {
  return `module.exports = function() { return ${JSON.stringify(obj)} };`;
};
