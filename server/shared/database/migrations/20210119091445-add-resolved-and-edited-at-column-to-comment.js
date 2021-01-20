'use strict';

const TABLE_NAME = 'comment';

const getColumns = ({ BOOLEAN, DATE }) => [
  { name: 'resolved', type: BOOLEAN, defaultValue: false },
  { name: 'edited_at', type: DATE, defaultValue: null }
];

exports.up = async (qi, Sequelize) => {
  const columns = getColumns(Sequelize);
  const transaction = await qi.sequelize.transaction();
  await Promise.all(columns.map(({ name, ...options }) => {
    return qi.addColumn(TABLE_NAME, name, { ...options, transaction });
  }));
  return transaction.commit();
};

exports.down = (qi, Sequelize) => {
  const columns = getColumns(Sequelize);
  return Promise.all(columns.map(({ name }) => qi.removeColumn(TABLE_NAME, name)));
};
