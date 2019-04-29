'use strict';

const mapValues = require('lodash/mapValues');
const pickBy = require('lodash/pickBy');

exports.afterInit = Model => {
  const views = {
    ...Model.views,
    clone: cloneView(Model)
  };
  Object.defineProperty(Model, 'views', {
    get: () => views
  });
};

function cloneView(Model) {
  const cloneableFields = pickBy(Model.rawAttributes, ({ meta }) => {
    return meta && Boolean(meta.clone);
  });
  return instance => mapValues(cloneableFields, (_, name) => instance.get(name));
}
