'use strict';

const flatMap = require('lodash/flatMap');
const groupBy = require('lodash/groupBy');
const keyBy = require('lodash/keyBy');
const mapValues = require('lodash/mapValues');
const mergeWith = require('lodash/mergeWith');
const values = require('lodash/values');

const byId = it => keyBy(it, 'id');
const byType = it => keyBy(it, 'type');
const equals = (str1 = '', str2 = '') => str1.toLowerCase() === str2.toLowerCase();
const mergeArrays = (arr1 = [], arr2 = []) => arr1.concat(arr2);

module.exports = (...configs) => {
  // Merge configs using custom logic without side-effects.
  return configs.reduce((acc, it) => mergeWith(acc, it, mergeConfigs), {});
};

function mergeConfigs(objValue, srcValue, key) {
  if (equals(key, 'CONTENT_CONTAINERS')) return mergeArrays(objValue, srcValue);
  if (equals(key, 'SCHEMAS')) return mergeSchemas(objValue, srcValue);
}

function mergeSchemas(schemas1 = [], schemas2 = []) {
  const result = mergeWith(
    // Convert schema lists to dictionaries using `id` as lookup key.
    byId(schemas1),
    byId(schemas2),
    // Merge schemas using custom logic.
    (objValue, srcValue, key) => {
      if (equals(key, 'structure')) return mergeStructures(objValue, srcValue);
    }
  );
  return values(result);
}

function mergeStructures(structure1 = [], structure2 = []) {
  const result = mergeWith(
    // Group structures by level,
    // then convert every group to dictionary using `type` as lookup key.
    mapValues(groupBy(structure1, 'level'), byType),
    mapValues(groupBy(structure2, 'level'), byType),
    // Always overwrite type's meta.
    (objValue, srcValue, key) => {
      if (equals(key, 'meta')) return srcValue;
    }
  );
  return flatMap(result, it => values(it));
}
