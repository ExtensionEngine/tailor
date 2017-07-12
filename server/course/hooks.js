const last = require('lodash/last');
const to = require('to-case');
const zip = require('lodash/zip');
const OUTLINE_LEVELS = require('../../config/shared/activities').OUTLINE_LEVELS;

const entities = ['ACTIVITY', 'TEACHING_ELEMENT'];
const hooks = ['afterCreate', 'afterDestroy'];
const operations = ['CREATE', 'REMOVE'];

function add(models) {
  zip(hooks, operations).forEach(hook => {
    entities.forEach(entity => {
      createHook(models, entity, hook);
    });
  });
}

function createHook(models, entity, [name, operation]) {
  const Course = models.Course;
  const LEAF = last(OUTLINE_LEVELS);
  const Model = models[to.pascal(entity)];

  Model.hook(name, (instance, { context }) => {
    const { courseId } = instance;
    if (instance.type === 'ASSESSMENT') {
      return updateStats(courseId, 'assessments');
    }
    if (instance.type === LEAF.type) {
      return updateStats(courseId, 'objectives', { type: LEAF.type });
    }
  });

  function updateStats(courseId, property, filter) {
    return Course.findById(courseId).then(course => {
      const where = Object.assign({ courseId }, filter);
      return Model.count({ where }).then(total => {
        course.stats = course.stats || {};
        course.stats[property] = total;
        course.changed('stats', true);
        return course.save();
      });
    });
  }
}

module.exports = {
  add
};
