'use strict';

const { getObjectives, getSchemaId } = require('../../config/shared/activities');
const forEach = require('lodash/forEach');
const castArray = require('lodash/castArray');
const find = require('lodash/find');
const first = require('lodash/first');
const logger = require('../shared/logger');
const map = require('lodash/map');

exports.add = (Course, Hooks, { Activity, TeachingElement }) => {
  const { Type } = Hooks;
  const hooks = [
    Type.afterCreate,
    Type.afterBulkCreate,
    Type.afterDestroy,
    Type.afterBulkDestroy
  ];

  forEach(hooks, type => {
    const hook = Hooks.withType(type, updateObjectiveStats);
    return Activity.addHook(type, hook);
  });
  forEach(hooks, type => {
    const hook = Hooks.withType(type, updateAssessmentStats);
    return TeachingElement.addHook(type, hook);
  });

  function updateObjectiveStats(hookType, instances) {
    const activity = first(castArray(instances));
    const { id, courseId, type } = activity;
    const schemaId = getSchemaId(type);
    if (!schemaId) return;
    logger.info(`[Course] Activity#${hookType}`, { type, id, courseId });
    const objectiveTypes = map(getObjectives(schemaId), 'type');
    const where = { courseId, type: objectiveTypes, detached: false };
    return Activity.count({ where })
      .then(count => Course.updateStats(courseId, 'objectives', count));
  }

  function updateAssessmentStats(hookType, instances) {
    const assessment = find(castArray(instances), { type: 'ASSESSMENT' });
    if (!assessment) return;
    const { id, courseId, type } = assessment;
    logger.info(`[Course] TeachingElement#${hookType}`, { type, id, courseId });
    const where = { courseId, type: 'ASSESSMENT', detached: false };
    return TeachingElement.count({ where })
      .then(count => Course.updateStats(courseId, 'assessments', count));
  }
};
