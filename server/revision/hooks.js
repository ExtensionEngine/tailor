import { constant } from 'to-case';
import createLogger from '../shared/logger.js';
import forEach from 'lodash/forEach.js';

const logger = createLogger('db');
const castArray = arg => Array.isArray(arg) ? arg : [arg];

export function add(Revision, Hooks, { Repository, Activity, ContentElement }) {
  const hooks = {
    [Hooks.afterCreate]: 'CREATE',
    [Hooks.afterUpdate]: 'UPDATE',
    [Hooks.afterDestroy]: 'REMOVE',
    [Hooks.afterBulkCreate]: 'CREATE'
  };

  const addHook = (Model, type, hook) => Model.addHook(type, Hooks.withType(type, hook));
  const isRepository = model => model instanceof Repository;

  // TODO: Repositories are soft deleted already?
  // When repository is removed, its id is no longer valid and cannot be saved
  // as a foreign key. Remove this when repositories are soft-deleted:
  addHook(Repository, Hooks.afterCreate, createRevisions);
  addHook(Repository, Hooks.afterUpdate, createRevisions);

  forEach(hooks, (_, type) => addHook(Activity, type, createRevisions));
  forEach(hooks, (_, type) => addHook(ContentElement, type, createRevisions));

  function createRevisions(hookType, instances, options) {
    instances = castArray(instances);
    const { context, transaction } = options;
    const records = instances.reduce((acc, it) => {
      const revision = getRevision(hookType, it, context);
      if (revision) acc.push(revision);
      return acc;
    }, []);
    if (!records.length) return;
    return Revision.bulkCreate(records, { transaction });
  }

  function getRevision(hookType, instance, context = {}) {
    if (!context.userId) return;
    const repositoryId = isRepository(instance) ? instance.id : instance.repositoryId;
    const entity = constant(instance.constructor.name);
    const operation = hooks[hookType];
    logger.info(`[Revision] ${entity}#${hookType}`, { entity, operation, id: instance.id, repositoryId });
    return {
      repositoryId,
      entity,
      operation,
      state: instance.toJSON(),
      userId: context.userId
    };
  }
}
