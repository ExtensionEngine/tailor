'use strict';
const _ = require('lodash');

const aggregateRevisions = revisions => {
  const result = _.chain(revisions)
  .groupBy('repository.name')
  .mapValues(values => _.chain(values)
    .groupBy('entity').mapValues(vals => _.chain(vals).groupBy('operation').value())
    .value()
  ).value();
  return result;
};

module.exports = {
  aggregateRevisions
};
