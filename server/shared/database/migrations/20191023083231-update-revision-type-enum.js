'use strict';

const { default: replaceEnum } = require('sequelize-replace-enum-postgres');

const TABLE_NAME = 'revision';
const COLUMN_NAME = 'entity';
const ENUM_NAME = `enum_${TABLE_NAME}_${COLUMN_NAME}`;

const COMMON_ROLES = { ACTIVITY: 'ACTIVITY', TEACHING_ELEMENT: 'TEACHING_ELEMENT' };
const OLD_ROLES = { COURSE: 'COURSE' };
const NEW_ROLES = { REPOSITORY: 'REPOSITORY' };
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
  await updateType(sequelize, [NEW_ROLES.REPOSITORY, OLD_ROLES.COURSE]);
  await changeTypeEnum(queryInterface, Object.values({ ...COMMON_ROLES, ...NEW_ROLES }));
};

exports.down = async queryInterface => {
  const { sequelize } = queryInterface;
  await changeTypeEnum(queryInterface, Object.values(ROLES));
  await updateType(sequelize, [OLD_ROLES.COURSE, NEW_ROLES.REPOSITORY]);
  await changeTypeEnum(queryInterface, Object.values({ ...COMMON_ROLES, ...OLD_ROLES }));
};

function updateType(db, replacements) {
  return db.query('UPDATE "revision" SET entity=? WHERE entity=?', { replacements });
}
