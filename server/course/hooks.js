'use strict';

const { getObjectives, getSchemaId } = require('../../config/shared/activities');
const forEach = require('lodash/forEach');
const castArray = require('lodash/castArray');
const find = require('lodash/find');
const first = require('lodash/first');
const logger = require('../shared/logger');
const map = require('lodash/map');

exports.add = (Course, models, { HookTypes, addHook }) => {
  const { Activity, TeachingElement } = models;
  const hooks = [
    HookTypes.afterCreate,
    HookTypes.afterBulkCreate,
    HookTypes.afterDestroy,
    HookTypes.afterBulkDestroy
  ];

  forEach(hooks, type => addHook(Activity, type, updateObjectiveStats));
  forEach(hooks, type => addHook(TeachingElement, type, updateAssessmentStats));

  function updateObjectiveStats(hookType, activities) {
    const activity = first(castArray(activities));
    const { id, courseId, type } = activity;
    const schemaId = getSchemaId(type);
    if (!schemaId) return;
    logger.info(`[Course] Activity#${hookType}`, { type, id, courseId });
    const objectiveTypes = map(getObjectives(schemaId), 'type');
    const where = { courseId, type: objectiveTypes, detached: false };
    return Activity.count({ where })
      .then(count => Course.updateStats(courseId, 'objectives', count));
  }

  function updateAssessmentStats(hookType, teachingElements) {
    const assessment = find(castArray(teachingElements), { type: 'ASSESSMENT' });
    const { id, courseId, type } = assessment;
    logger.info(`[Course] TeachingElement#${hookType}`, { type, id, courseId });
    const where = { courseId, type: 'ASSESSMENT', detached: false };
    return TeachingElement.count({ where })
      .then(count => Course.updateStats(courseId, 'assessments', count));
  }
};
