'use strict';

const TABLE_NAME = 'comment';

const getColumns = ({ BOOLEAN, DATE }) => [
  { name: 'resolved', type: BOOLEAN, defaultValue: false },
  { name: 'edited_at', type: DATE, defaultValue: null }
];

exports.up = (qi, Sequelize) => {
  const columns = getColumns(Sequelize);
  return qi.sequelize.transaction(transaction => {
    const pendingColumns = columns.map(({ name, ...options }) => {
      return qi.addColumn(TABLE_NAME, name, { ...options, transaction });
    });
    return Promise.all(pendingColumns);
  });
};

exports.down = (qi, Sequelize) => {
  const columns = getColumns(Sequelize);
  return Promise.all(columns.map(({ name }) => qi.removeColumn(TABLE_NAME, name)));
};
