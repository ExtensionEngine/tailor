const addHooks = require('../shared/util/addHooks');
const { getObjectives, getSchemaId } = require('../../config/shared/activities');
const logger = require('../shared/logger');
const map = require('lodash/map');

module.exports = { add };

function add(Course, models) {
  const { Activity, TeachingElement } = models;
  const hooks = ['afterCreate', 'afterDestroy'];

  // Track objectives.
  addHooks(Activity, hooks, (hook, instance, options) => {
    const { id, courseId, type } = instance;
    logger.info(`[Course] Activity#${hook}`, { type, id, courseId });
    const objectiveTypes = map(getObjectives(getSchemaId(type)), 'type');
    const where = { courseId, type: { $in: objectiveTypes }, detached: false };
    return Activity.count({ where })
      .then(count => Course.updateStats(courseId, 'objectives', count));
  });

  // Track assessments.
  addHooks(TeachingElement, hooks, (hook, instance, { context }) => {
    if (instance.type !== 'ASSESSMENT') return;
    const { id, courseId, type } = instance;
    logger.info(`[Course] TeachingElement#${hook}`, { type, id, courseId });
    const where = { courseId, type: 'ASSESSMENT', detached: false };
    return TeachingElement.count({ where })
      .then(count => Course.updateStats(courseId, 'assessments', count));
  });
}
