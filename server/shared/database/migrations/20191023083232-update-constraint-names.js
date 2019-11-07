'use strict';

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

module.exports = {
  up: async queryInterface => {
    const { sequelize } = queryInterface;
    MAPPINGS.forEach(it => updateConstraint(sequelize, it));
  },
  down: async queryInterface => {
    const { sequelize } = queryInterface;
    MAPPINGS.forEach(it => updateConstraint(sequelize, [it[0], it[2], it[1]]));
  }
};

async function updateConstraint(db, [table, oldName, newName]) {
  await db.query(`ALTER TABLE ${table} RENAME CONSTRAINT ${oldName} TO ${newName}`);
}
