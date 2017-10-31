const find = require('lodash/find');
const Promise = require('bluebird');

module.exports = {
  up(queryInterface, Sequelize, { sequelize, Activity }) {
    const opts = { type: sequelize.QueryTypes.SELECT };
    const fetch = Promise.join(
      sequelize.query('SELECT id, name FROM public.activity', opts),
      Activity.findAll());
    return fetch.then(([query, activities]) => {
      return Promise.map(activities, it => {
        it.data = it.data || {};
        const name = find(query, { id: it.id }).name;
        if (name) {
          it.data.name = name;
          it.changed('data', true);
        }
        return it.save();
      });
    }).then(() => queryInterface.removeColumn('activity', 'name'));
  },
  down(queryInterface, Sequelize) {
    return queryInterface.addColumn('activity', 'name', {
      type: Sequelize.STRING
    });
  }
};
