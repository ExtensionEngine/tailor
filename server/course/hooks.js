const { getObjectives, getSchemaId } = require('../../config/shared/activities');
const addHooks = require('../shared/util/addHooks');
const find = require('lodash/find');
const first = require('lodash/first');
const logger = require('../shared/logger');
const map = require('lodash/map');

module.exports = { add };

function add(Course, models) {
  const { Activity, TeachingElement } = models;
  const hooks = ['afterCreate', 'afterBulkCreate', 'afterDestroy', 'afterBulkDestroy'];

  // Track objectives.
  addHooks(Activity, hooks, (hook, data, options) => {
    const instance = Array.isArray(data) ? first(data) : data;
    const { id, courseId, type } = instance;
    const schemaId = getSchemaId(type);
    if (!schemaId) return;
    logger.info(`[Course] Activity#${hook}`, { type, id, courseId });
    const objectiveTypes = map(getObjectives(schemaId), 'type');
    const where = { courseId, type: { $in: objectiveTypes }, detached: false };
    return Activity.count({ where })
      .then(count => Course.updateStats(courseId, 'objectives', count));
  });

  // Track assessments.
  addHooks(TeachingElement, hooks, (hook, data, { context }) => {
    const instance = Array.isArray(data)
      ? find(data, { type: 'ASSESSMENT' })
      : data;
    if (instance.type !== 'ASSESSMENT') return;
    const { id, courseId, type } = instance;
    logger.info(`[Course] TeachingElement#${hook}`, { type, id, courseId });
    const where = { courseId, type: 'ASSESSMENT', detached: false };
    return TeachingElement.count({ where })
      .then(count => Course.updateStats(courseId, 'assessments', count));
  });
}
