'use strict';

const { default: replaceEnum } = require('sequelize-replace-enum-postgres');

const TABLE_NAME = 'revision';
const COLUMN_NAME = 'entity';
const ENUM_NAME = `enum_${TABLE_NAME}_${COLUMN_NAME}`;

const COMMON_ROLES = { ACTIVITY: 'ACTIVITY', REPOSITORY: 'REPOSITORY' };
const OLD_ROLES = { TEACHING_ELEMENT: 'TEACHING_ELEMENT' };
const NEW_ROLES = { CONTENT_ELEMENT: 'CONTENT_ELEMENT' };
const ROLES = { ...COMMON_ROLES, ...OLD_ROLES, ...NEW_ROLES };

const changeTypeEnum = (queryInterface, values) => replaceEnum({
  queryInterface,
  tableName: TABLE_NAME,
  columnName: COLUMN_NAME,
  enumName: ENUM_NAME,
  newValues: values
});

exports.up = async queryInterface => {
  const { sequelize } = queryInterface;
  await changeTypeEnum(queryInterface, Object.values(ROLES));
  await updateType(sequelize, [NEW_ROLES.CONTENT_ELEMENT, OLD_ROLES.TEACHING_ELEMENT]);
  await changeTypeEnum(queryInterface, Object.values({ ...COMMON_ROLES, ...NEW_ROLES }));
};

exports.down = async queryInterface => {
  const { sequelize } = queryInterface;
  await changeTypeEnum(queryInterface, Object.values(ROLES));
  await updateType(sequelize, [OLD_ROLES.TEACHING_ELEMENT, NEW_ROLES.CONTENT_ELEMENT]);
  await changeTypeEnum(queryInterface, Object.values({ ...COMMON_ROLES, ...OLD_ROLES }));
};

function updateType(db, replacements) {
  return db.query('UPDATE "revision" SET entity=? WHERE entity=?', { replacements });
}
