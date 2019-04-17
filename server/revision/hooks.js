'use strict';

const { constant } = require('to-case');
const logger = require('../shared/logger');

module.exports = { add };

function add(Revision, models, { HookTypes, addHooks }) {
  const { Course, Activity, TeachingElement } = models;
  const hooksDict = {
    [HookTypes.afterCreate]: 'CREATE',
    [HookTypes.afterUpdate]: 'UPDATE',
    [HookTypes.afterDestroy]: 'REMOVE'
  };
  const hooks = Object.keys(hooksDict);

  // TODO: Courses are soft deleted already?
  // When course is removed, its id is no longer valid and cannot be saved
  // as a foreign key. Remove this when courses are soft-deleted:
  addHooks(Course, [HookTypes.afterCreate, HookTypes.afterUpdate], createRevision);

  addHooks(Activity, hooks, createRevision);
  addHooks(TeachingElement, hooks, createRevision);

  function createRevision(hook, instance, { context, transaction }) {
    if (!context || !context.userId) return;
    const Model = instance.constructor;
    const courseId = Model.name === Course.name ? instance.id : instance.courseId;
    const entity = constant(Model.name);
    const operation = hooksDict[hook];
    const state = instance.get({ plain: true });
    logger.info(`[Revision] ${entity}#${hook}`, { entity, operation, id: instance.id, courseId });
    const revision = { courseId, entity, operation, state, userId: context.userId };
    return Revision.create(revision, { transaction });
  }
}
