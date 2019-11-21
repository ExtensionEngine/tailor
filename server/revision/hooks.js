'use strict';

const { constant } = require('to-case');
const forEach = require('lodash/forEach');
const logger = require('../shared/logger');

module.exports = { add };

function add(Revision, Hooks, { Repository, Activity, ContentElement }) {
  const hooks = {
    [Hooks.afterCreate]: 'CREATE',
    [Hooks.afterUpdate]: 'UPDATE',
    [Hooks.afterDestroy]: 'REMOVE'
  };

  const addHook = (Model, type, hook) => Model.addHook(type, Hooks.withType(type, hook));
  const isRepository = model => model instanceof Repository;

  // TODO: Repositories are soft deleted already?
  // When repository is removed, its id is no longer valid and cannot be saved
  // as a foreign key. Remove this when repositories are soft-deleted:
  addHook(Repository, Hooks.afterCreate, createRevision);
  addHook(Repository, Hooks.afterUpdate, createRevision);

  forEach(hooks, (_, type) => addHook(Activity, type, createRevision));
  forEach(hooks, (_, type) => addHook(ContentElement, type, createRevision));

  function createRevision(hookType, instance, { context = {}, transaction }) {
    if (!context.userId) return;
    const repositoryId = isRepository(instance) ? instance.id : instance.repositoryId;
    const entity = constant(instance.constructor.name);
    const operation = hooks[hookType];
    logger.info(`[Revision] ${entity}#${hookType}`, { entity, operation, id: instance.id, repositoryId });
    const revision = {
      repositoryId,
      entity,
      operation,
      state: instance.toJSON(),
      userId: context.userId
    };
    return Revision.create(revision, { transaction });
  }
}
