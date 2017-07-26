const addHooks = require('../shared/util/addHooks');
const last = require('lodash/last');
const logger = require('../shared/logger');
const { OUTLINE_LEVELS } = require('../../config/shared/activities');
const LEAF = last(OUTLINE_LEVELS);

module.exports = { add };

function add(Course, models) {
  const { Activity, TeachingElement } = models;
  const hooks = ['afterCreate', 'afterDestroy'];

  // Track leafs.
  addHooks(Activity, hooks, (hook, instance, options) => {
    if (instance.type !== LEAF.type) return;
    const { courseId } = instance;
    logger.info(`[Course] Activity#${hook}`, { type: LEAF.type, id: instance.id, courseId });
    // TODO: Ignore detached leafs!
    const where = { courseId, type: LEAF.type };
    return Activity.count({ where })
      .then(count => Course.updateStats(courseId, 'objectives', count));
  });

  // Track assessments.
  addHooks(TeachingElement, hooks, (hook, instance, { context }) => {
    if (instance.type !== 'ASSESSMENT') return;
    const { courseId } = instance;
    logger.info(`[Course] TeachingElement#${hook}`, { type: instance.type, id: instance.id, courseId });
    // TODO: Ignore detached assessments!
    const where = { courseId, type: 'ASSESSMENT' };
    return TeachingElement.count({ where })
      .then(count => Course.updateStats(courseId, 'assessments', count));
  });
}
