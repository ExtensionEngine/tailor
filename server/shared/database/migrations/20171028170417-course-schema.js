const Promise = require('bluebird');

const DEFAULT_SCHEMA = 'COURSE';
const ACTIVITY_TYPES = ['GOAL', 'OBJECTIVE', 'TOPIC', 'INTERACTIVE_EXERCISE'];

module.exports = {
  up(queryInterface, Sequelize, { Course, Activity }) {
    return Activity.findAll()
      .then(activities => {
        return Promise.map(activities, it => {
          if (!ACTIVITY_TYPES.includes(it.type)) return it;
          it.type = `${DEFAULT_SCHEMA}/${it.type}`;
          return it.save();
        });
      })
      .then(() => {
        return queryInterface.addColumn('course', 'schema', {
          type: Sequelize.STRING
        });
      })
      .then(() => {
        return Course.findAll().then(courses => {
          return Promise.map(courses, it => {
            it.schema = DEFAULT_SCHEMA;
            return it.save();
          });
        });
      });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('course', 'schema');
  }
};
