'use strict';

const { constant } = require('to-case');
const castArray = require('lodash/castArray');
const forEach = require('lodash/forEach');
const groupBy = require('lodash/groupBy');
const logger = require('../shared/logger');

module.exports = { add };

function add(Revision, Hooks, { Course, Activity, TeachingElement }) {
  const { Operation } = Revision;
  const hooks = {
    [Hooks.afterBulkCreate]: Operation.Create,
    [Hooks.afterCreate]: Operation.Create,
    [Hooks.afterUpdate]: Operation.Update,
    [Hooks.afterBulkUpdate]: Operation.Update,
    [Hooks.afterDestroy]: Operation.Remove,
    [Hooks.afterBulkDestroy]: Operation.Remove
  };

  const addHook = (Model, type, hook) => Model.addHook(type, Hooks.withType(type, hook));
  const isCourse = model => model instanceof Course;

  // TODO: Courses are soft deleted already?
  // When course is removed, its id is no longer valid and cannot be saved
  // as a foreign key. Remove this when courses are soft-deleted:
  addHook(Course, Hooks.afterCreate, createRevisions);
  addHook(Course, Hooks.afterUpdate, createRevisions);

  forEach(hooks, (_, type) => addHook(Activity, type, createRevisions));
  forEach(hooks, (_, type) => addHook(TeachingElement, type, createRevisions));

  function createRevisions(hookType, instances, { context = {}, transaction }) {
    if (!context.userId) return;
    const operation = hooks[hookType];
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
