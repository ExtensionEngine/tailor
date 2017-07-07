const pluralize = require('pluralize');
const to = require('to-case');
const zip = require('lodash/zip');

const hooks = ['afterCreate', 'afterUpdate', 'afterDestroy'];
const operations = ['CREATE', 'UPDATE', 'REMOVE'];
const OUTLINE_LEVELS = require('../../config/shared/activities').OUTLINE_LEVELS;
const entities = ['ACTIVITY', 'TEACHING_ELEMENT'];

function add(models) {
  zip(hooks, operations).forEach(hook => {
    entities.forEach(entity => {
      createHook(models, entity, hook);
    });
  });
}

function createHook(models, entity, [name, operation]) {
  const Course = models.Course;
  const lastLevel = OUTLINE_LEVELS[OUTLINE_LEVELS.length - 1];
  const Model = models[to.pascal(entity)];
  const counter = operation === 'REMOVE' ? -1 : 1;

  Model.hook(name, (instance, { context }) => {
    if (instance.type === lastLevel.type) {
      updateStats(instance, to.lower(pluralize(lastLevel.type)));
    }
    if (instance.type === 'ASSESSMENT') {
      updateStats(instance, 'assessments');
    }
  });

  function updateStats(instance, property) {
    return Course.findById(instance.courseId)
      .then(course => {
        course.stats[property] += counter;
        course.changed('stats', true);
        return course.save();
      });
  }
}

module.exports = {
  add
};
