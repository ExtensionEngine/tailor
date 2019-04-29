'use strict';

module.exports = Sequelize => {
  const { init } = Sequelize.Model;
  Sequelize.Model.init = function (attributes, options) {
    const { beforeInit, afterInit } = getMixins(this);
    beforeInit.forEach(mixin => mixin(this));
    const model = init.apply(this, arguments);
    afterInit.forEach(mixin => mixin(model));
    return model;
  };
};

function getMixins(Model) {
  const { mixins = [] } = Model;
  return mixins.reduce((acc, { beforeInit, afterInit } = {}) => {
    if (beforeInit) acc.beforeInit.push(beforeInit);
    if (afterInit) acc.afterInit.push(afterInit);
    return acc;
  }, { beforeInit: [], afterInit: [] });
}
