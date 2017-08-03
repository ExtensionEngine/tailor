const addHooks = require('../shared/util/addHooks');
const includes = require('lodash/includes');
const logger = require('../shared/logger');
const { OBJECTIVES } = require('../../config/shared/activities');
const objectiveTypes = OBJECTIVES.map(it => it.type);

module.exports = { add };

function add(Course, models) {
  const { Activity, TeachingElement } = models;
  const hooks = ['afterCreate', 'afterDestroy'];

  // Track objectives.
  addHooks(Activity, hooks, (hook, instance, options) => {
    if (!includes(objectiveTypes, instance.type)) return;
    const { id, courseId, type } = instance;
    logger.info(`[Course] Activity#${hook}`, { type, id, courseId });
    // TODO: Ignore detached objectives!
    const where = { courseId, type: objectiveTypes };
    return Activity.count({ where })
      .then(count => Course.updateStats(courseId, 'objectives', count));
  });

  // Track assessments.
  addHooks(TeachingElement, hooks, (hook, instance, { context }) => {
    if (instance.type !== 'ASSESSMENT') return;
    const { id, courseId, type } = instance;
    logger.info(`[Course] TeachingElement#${hook}`, { type, id, courseId });
    // TODO: Ignore detached assessments!
    const where = { courseId, type: 'ASSESSMENT' };
    return TeachingElement.count({ where })
      .then(count => Course.updateStats(courseId, 'assessments', count));
  });
}
