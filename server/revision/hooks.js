'use strict';

const { constant } = require('to-case');
const forEach = require('lodash/forEach');
const logger = require('../shared/logger');

module.exports = { add };

function add(Revision, Hooks, { Course, Activity, TeachingElement }) {
  const hooks = {
    [Hooks.afterCreate]: 'CREATE',
    [Hooks.afterUpdate]: 'UPDATE',
    [Hooks.afterDestroy]: 'REMOVE'
  };

  const addHook = (Model, type, hook) => Model.addHook(type, Hooks.withType(type, hook));
  const isCourse = model => model instanceof Course;

  // TODO: Courses are soft deleted already?
  // When course is removed, its id is no longer valid and cannot be saved
  // as a foreign key. Remove this when courses are soft-deleted:
  addHook(Course, Hooks.afterCreate, createRevision);
  addHook(Course, Hooks.afterUpdate, createRevision);

  forEach(hooks, (_, type) => addHook(Activity, type, createRevision));
  forEach(hooks, (_, type) => addHook(TeachingElement, type, createRevision));

  function createRevision(hookType, instance, { context = {}, transaction }) {
    if (!context.userId) return;
    const courseId = isCourse(instance) ? instance.id : instance.courseId;
    const entity = constant(instance.constructor.name);
    const operation = hooks[hookType];
    logger.info(`[Revision] ${entity}#${hookType}`, { entity, operation, id: instance.id, courseId });
    const revision = { courseId, entity, operation, state: instance.toJSON(), userId: context.userId };
    return Revision.create(revision, { transaction });
  }
}
