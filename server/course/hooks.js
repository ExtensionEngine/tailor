'use strict';

const { getObjectives, getSchemaId } = require('../../config/shared/activities');
const find = require('lodash/find');
const first = require('lodash/first');
const get = require('lodash/get');
const logger = require('../shared/logger');
const map = require('lodash/map');

exports.add = (Course, models, { HookTypes, addHooks }) => {
  const { Activity, TeachingElement } = models;
  const hooks = [
    HookTypes.afterCreate,
    HookTypes.afterBulkCreate,
    HookTypes.afterDestroy,
    HookTypes.afterBulkDestroy
  ];

  // Track objectives.
  addHooks(Activity, hooks, (hookType, data, options) => {
    const instance = Array.isArray(data) ? first(data) : data;
    const { id, courseId, type } = instance;
    const schemaId = getSchemaId(type);
    if (!schemaId) return;
    logger.info(`[Course] Activity#${hookType}`, { type, id, courseId });
    const objectiveTypes = map(getObjectives(schemaId), 'type');
    const where = { courseId, type: objectiveTypes, detached: false };
    return Activity.count({ where })
      .then(count => Course.updateStats(courseId, 'objectives', count));
  });

  // Track assessments.
  addHooks(TeachingElement, hooks, (hookType, data, { context }) => {
    const instance = Array.isArray(data)
      ? find(data, { type: 'ASSESSMENT' })
      : data;
    if (get(instance, 'type') !== 'ASSESSMENT') return;
    const { id, courseId, type } = instance;
    logger.info(`[Course] TeachingElement#${hookType}`, { type, id, courseId });
    const where = { courseId, type: 'ASSESSMENT', detached: false };
    return TeachingElement.count({ where })
      .then(count => Course.updateStats(courseId, 'assessments', count));
  });
};
