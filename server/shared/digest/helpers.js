'use strict';
const flow = require('lodash/fp/flow');
const map = require('lodash/fp/map');
const values = require('lodash/fp/values');
const _ = require('lodash');

const aggregateRevisions = revisions => {
  const result = _.chain(revisions)
  .groupBy('repository.name')
  .mapValues(changes => _.chain(changes)
    .groupBy('entity')
    .mapValues(operations => _.chain(operations)
      .groupBy('operation')
      .value())
    .value()
  ).value();

  flow(
    values,
    map(activity => flow(
      values,
      map(x => {
        Object.keys(x)
        .map(elem => { x[elem] = x[elem].length; });
      })
    )(activity))
  )(result);

  return Object.keys(result).map(key => { return { repoName: key, ...result[key] }; });
};

module.exports = {
  aggregateRevisions
};
