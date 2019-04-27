'use strict';

const mapValues = require('lodash/mapValues');
const pickBy = require('lodash/pickBy');

module.exports = Model => {
  const { init } = Model;
  Model.init = function () {
    return setupViews(init.apply(this, arguments));
  };
};

function setupViews(Model) {
  const views = {
    ...Model.views,
    clone: cloneView(Model)
  };
  Object.defineProperty(Model, 'views', {
    get: () => views
  });
  return Model;
}

function cloneView(Model) {
  const cloneableFields = pickBy(Model.rawAttributes, ({ meta }) => {
    return meta && Boolean(meta.clone);
  });
  return instance => mapValues(cloneableFields, (_, name) => instance.get(name));
}
