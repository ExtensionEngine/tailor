'use strict';
const _ = require('lodash');

const aggregateRevisions = revisions => {
  const final = [];

  const result = _.chain(revisions)
  .groupBy('repository.name')
  .mapValues(values => _.chain(values)
    .groupBy('entity').mapValues(vals => _.chain(vals).groupBy('operation').value())
    .value()
  ).value();

  Object.keys(result).map(key => {
    const entities = { ...result[key] };
    final.push({ repoName: key, ...entities });
    Object.keys(entities).map(name => {
      Object.keys(entities[name])
      .map(subkey => {
        entities[name][subkey] = entities[name][subkey].length;
      });
      final.push({ repoName: key, ...entities });
    });
  });
  console.log(final);
  return result;
};

module.exports = {
  aggregateRevisions
};
