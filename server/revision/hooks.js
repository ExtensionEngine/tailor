const capitalize = require('lodash/capitalize');
const zip = require('lodash/zip');

const hooks = ['afterCreate', 'afterUpdate', 'afterDestroy'];
const operations = ['CREATE', 'UPDATE', 'REMOVE'];
const entities = ['ACTIVITY', 'ASSET', 'COURSE'];

function add(models) {
  zip(hooks, operations).forEach(hook => {
    entities.forEach(entity => {
      createHook(models, entity, hook);
    });
  });
}

function createHook(models, entity, [name, operation]) {
  // When course is removed, its id is no longer valid and cannot be saved
  // as a foreign key. Remove this check when courses are soft-deleted:
  if (entity === 'COURSE' && operation === 'REMOVE') return;

  const Revision = models.Revision;
  const Model = models[capitalize(entity)];

  Model.hook(name, (instance, { context }) => {
    if (!context || !context.userId) return;
    Revision.create({
      courseId: entity === 'COURSE' ? instance.id : instance.courseId,
      entity,
      operation,
      state: instance.get({ plain: true }),
      userId: context.userId
    });
  });
}

module.exports = {
  add
};
