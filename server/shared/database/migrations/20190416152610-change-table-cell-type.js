'use strict';

const TABLE_NAME = 'teaching_element';

function findTables(queryInterface) {
  const where = { type: 'TABLE' };
  return queryInterface.rawSelect(TABLE_NAME, { where, plain: false }, null);
}

function setCellType({ data }, type) {
  if (!data.embeds) return;
  data.embeds = mapKeys(data.embeds, (data, id) => {
    return Object.assign({}, data, { type });
  });
}

exports.up = async queryInterface => {
  const tables = await findTables(queryInterface);
  return Promise.all(tables.map(({ id, data }) => {
    setCellType({ data }, 'HTML');
    return queryInterface.update({}, TABLE_NAME, { data }, { id });
  }));
};

exports.down = async queryInterface => {
  const tables = await findTables(queryInterface);
  return Promise.all(tables.map(({ id, data }) => {
    setCellType({ data }, 'TABLE-CELL');
    return queryInterface.update({}, TABLE_NAME, { data }, { id });
  }));
};

function mapKeys(obj, cb) {
  return Object.keys(obj).reduce((acc, key) => {
    const val = cb(obj[key], key);
    return Object.assign(acc, { [key]: val });
  }, {});
}
