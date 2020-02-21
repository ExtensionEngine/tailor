'use strict';

const groupBy = require('lodash/groupBy');
const mapKeys = require('lodash/mapKeys');
const groupArray = require('group-array');
const util = require('util');

const aggregateRevisions = revisions => {
  const groupedRevisions = groupArray(revisions, 'user.email', 'repository.name', 'entity_operation');
  return groupedRevisions;
};

module.exports = {
  aggregateRevisions
};
