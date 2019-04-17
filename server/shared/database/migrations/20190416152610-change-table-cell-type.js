'use strict';

const forEach = require('lodash/forEach');
const Promise = require('bluebird');

function getElements(sequelize, transaction) {
  return sequelize.query(
    "SELECT * FROM teaching_element t WHERE t.type = 'TABLE'",
    { type: sequelize.QueryTypes.SELECT, transaction });
}

// NOTE: bulkInsert with updateOnDuplicate not working, avoiding model methods
function bulkUpdate(sequelize, elements, transaction) {
  return Promise.map(elements, ({ id, data }) => {
    sequelize.query(
      'UPDATE teaching_element SET data = :data WHERE id = :id',
      { replacements: { id, data: JSON.stringify(data) }, transaction });
  });
}

function updateCellType(elements, type = 'HTML') {
  forEach(elements, el => forEach(el.data.embeds, embed => (embed.type = type)));
}

module.exports = {
  up: queryInterface => {
    const { sequelize } = queryInterface;
    return sequelize.transaction(async transaction => {
      const elements = await getElements(sequelize, transaction);
      updateCellType(elements);
      return bulkUpdate(sequelize, elements, transaction);
    });
  },
  down: queryInterface => {
    const { sequelize } = queryInterface;
    return sequelize.transaction(async transaction => {
      const elements = await getElements(sequelize, transaction);
      updateCellType(elements, 'TABLE-CELL');
      return bulkUpdate(sequelize, elements, transaction);
    });
  }
};
