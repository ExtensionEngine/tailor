const zip = require('lodash/zip');
const capitalize = require('lodash/capitalize');

const entities = ['ACTIVITY', 'ASSET', 'COURSE'];
const operations = ['CREATE', 'UPDATE', 'REMOVE'];
const hooks = ['afterCreate', 'afterUpdate', 'afterDestroy'];

function add (models) {
  zip(operations, hooks).forEach(([operation, hook]) => {
    entities.forEach(entity => {
      // When course is removed, its id is no longer valid and cannot be saved
      // as a foreign key. Remove this check when courses are soft-deleted:
      if (entity === 'COURSE' && operation === 'REMOVE') return;

      const Revision = models.Revision;
      const Model = models[capitalize(entity)];
      Model.hook(hook, (instance, { context }) => {
        if (context && context.userId) {
          Revision.create({
            courseId: entity === 'COURSE' ? instance.id : instance.courseId,
            entity,
            operation,
            state: instance.get({ plain: true }),
            userId: context.userId
          });
        }
      });
    });
  });
}

module.exports = {
  add
};
