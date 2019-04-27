'use strict';

const { constant } = require('to-case');
const castArray = require('lodash/castArray');
const forEach = require('lodash/forEach');
const groupBy = require('lodash/groupBy');
const logger = require('../shared/logger');

module.exports = { add };

function add(Revision, Hooks, { Course, Activity, TeachingElement }) {
  const { Operation } = Revision;
  const { Type } = Hooks;
  const hooks = {
    [Type.afterCreate]: Operation.Create,
    [Type.afterUpdate]: Operation.Update,
    [Type.afterDestroy]: Operation.Remove
  };

  const addHook = (Model, type, hook) => Model.addHook(type, Hooks.withType(type, hook));
  const isCourse = model => model instanceof Course;

  // TODO: Courses are soft deleted already?
  // When course is removed, its id is no longer valid and cannot be saved
  // as a foreign key. Remove this when courses are soft-deleted:
  addHook(Course, Type.afterCreate, revisionHook(Operation.Create));
  addHook(Course, Type.afterUpdate, revisionHook(Operation.Update));

  // Add individual operation hooks.
  forEach(hooks, (operation, type) => addHook(Activity, type, revisionHook(operation)));
  forEach(hooks, (operation, type) => addHook(TeachingElement, type, revisionHook(operation)));
  // Add bulk operation hooks (cloning).
  addHook(Activity, 'afterBulkClone', revisionHook(Operation.Create));
  addHook(TeachingElement, 'afterBulkClone', revisionHook(Operation.Create));

  function revisionHook(operation) {
    return (type, instances, options) => {
      return createRevisions(type, instances, { ...options, operation });
    };
  }

  function createRevisions(hookType, instances, { context = {}, operation, transaction }) {
    if (!context.userId) return;
    const revisions = castArray(instances).map(instance => {
      const courseId = isCourse(instance) ? instance.id : instance.courseId;
      const entity = constant(instance.constructor.name);
      return {
        courseId,
        entity,
        operation,
        state: instance.toJSON(),
        userId: context.userId
      };
    });
    forEach(groupBy(revisions, 'entity'), (revisions, entity) => {
      const data = revisions.map(it => formatRevision(it));
      logger.info(`[Revision] ${entity}#${hookType}`, data);
    });
    return Revision.bulkCreate(revisions, { transaction });
  }
}

function formatRevision({ courseId, entity, operation, state }) {
  const { id } = state;
  return { entity, operation, id, courseId };
}
