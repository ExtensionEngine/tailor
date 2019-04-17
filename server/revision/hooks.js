'use strict';

const { pascalCase } = require('change-case');
const forEach = require('lodash/forEach');
const logger = require('../shared/logger');

module.exports = { add };

function add(Revision, models, { HookTypes, addHook }) {
  const { Course, Activity, TeachingElement } = models;
  const hooks = {
    [HookTypes.afterCreate]: 'CREATE',
    [HookTypes.afterUpdate]: 'UPDATE',
    [HookTypes.afterDestroy]: 'REMOVE'
  };
  const isCourse = model => model instanceof Course;

  // TODO: Courses are soft deleted already?
  // When course is removed, its id is no longer valid and cannot be saved
  // as a foreign key. Remove this when courses are soft-deleted:
  addHook(Course, HookTypes.afterCreate, createRevision);
  addHook(Course, HookTypes.afterUpdate, createRevision);

  forEach(hooks, (_, type) => addHook(Activity, type, createRevision));
  forEach(hooks, (_, type) => addHook(TeachingElement, type, createRevision));

  function createRevision(hookType, instance, { context = {}, transaction }) {
    if (!context.userId) return;
    const courseId = isCourse(instance) ? instance.id : instance.courseId;
    const entity = pascalCase(instance.constructor.name);
    const operation = hooks[hookType];
    logger.info(`[Revision] ${entity}#${hookType}`, { entity, operation, id: instance.id, courseId });
    const revision = { courseId, entity, operation, state: instance.toJSON(), userId: context.userId };
    return Revision.create(revision, { transaction });
  }
}
