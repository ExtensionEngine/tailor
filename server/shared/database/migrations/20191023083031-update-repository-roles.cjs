'use strict';

const Promise = require('bluebird');
const { default: replaceEnum } = require('sequelize-replace-enum-postgres');

const TABLE_NAME = 'repository_user';
const COLUMN_NAME = 'role';
const ENUM_NAME = `enum_course_user_${COLUMN_NAME}`;

const OLD_ROLES = { COURSE_AUTHOR: 'COURSE_AUTHOR', COURSE_ADMIN: 'COURSE_ADMIN' };
const NEW_ROLES = { AUTHOR: 'AUTHOR', ADMIN: 'ADMIN' };
const ROLES = { ...OLD_ROLES, ...NEW_ROLES };

const changeRoleColumn = (queryInterface, values) => replaceEnum({
  queryInterface,
  tableName: TABLE_NAME,
  columnName: COLUMN_NAME,
  defaultValue: values.includes(ROLES.AUTHOR) ? ROLES.AUTHOR : ROLES.COURSE_AUTHOR,
  enumName: ENUM_NAME,
  newValues: values
});

exports.up = async queryInterface => {
  await changeRoleColumn(queryInterface, Object.values(ROLES));
  await updateRoles(queryInterface.sequelize, [
    [NEW_ROLES.AUTHOR, OLD_ROLES.COURSE_AUTHOR],
    [NEW_ROLES.ADMIN, OLD_ROLES.COURSE_ADMIN]
  ]);
  await changeRoleColumn(queryInterface, Object.values(NEW_ROLES));
};

exports.down = async queryInterface => {
  await changeRoleColumn(queryInterface, Object.values(ROLES));
  await updateRoles(queryInterface.sequelize, [
    [OLD_ROLES.COURSE_AUTHOR, NEW_ROLES.AUTHOR],
    [OLD_ROLES.COURSE_ADMIN, NEW_ROLES.ADMIN]
  ]);
  await changeRoleColumn(queryInterface, Object.values(OLD_ROLES));
};

function updateRoles(db, mappings) {
  return db.transaction(transaction => Promise.map(mappings, doUpdate(transaction)));

  function doUpdate(transaction) {
    const query = 'UPDATE "repository_user" SET role=? WHERE role=?';
    return replacements => db.query(query, { replacements, transaction });
  }
}
