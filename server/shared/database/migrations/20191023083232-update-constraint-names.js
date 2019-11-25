'use strict';

const Promise = require('bluebird');

// Table, current constraint name, new constraint name
const MAPPINGS = [
  ['repository', 'course_pkey', 'repository_pkey'],
  ['repository', 'course_uid_key', 'repository_uid_key'],
  ['repository_user', 'course_user_pkey', 'repository_user_pkey'],
  ['repository_user', 'course_user_course_id_fkey', 'repository_user_repository_id_fkey'],
  ['repository_user', 'course_user_user_id_fkey', 'repository_user_user_id_fkey']
];

// Standard foreign key names
['activity', 'comment', 'revision', 'teaching_element'].forEach(table => {
  MAPPINGS.push([table, `${table}_course_id_fkey`, `${table}_repository_id_fkey`]);
});

exports.up = queryInterface => {
  const { sequelize: db } = queryInterface;
  return Promise.each(MAPPINGS, it => updateConstraint(db, it));
};

exports.down = queryInterface => {
  const { sequelize: db } = queryInterface;
  return Promise.each(MAPPINGS, it => updateConstraint(db, [it[0], it[2], it[1]]));
};

function updateConstraint(db, [table, oldName, newName]) {
  return db.query(`ALTER TABLE ${table} RENAME CONSTRAINT ${oldName} TO ${newName}`);
}
