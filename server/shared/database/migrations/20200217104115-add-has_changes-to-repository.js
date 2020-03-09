'use strict';

const head = require('lodash/head');
const Promise = require('bluebird');
const some = require('lodash/some');

const TABLE_NAME = 'repository';
const COLUMN_NAME = 'has_changes';

const isModified = it => it.modifiedAt > it.publishedAt;

exports.up = async (qi, { BOOLEAN }) => {
  await qi.addColumn(TABLE_NAME, COLUMN_NAME, { type: BOOLEAN });
  await updateHasChanges(qi);
};

exports.down = queryInterface => {
  return queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME);
};

async function updateHasChanges({ sequelize }) {
  const t = await sequelize.transaction();
  const repositories = await getRepositories(sequelize, t);
  await Promise.map(repositories, async ({ id }) => {
    const activities = await getOutlineActivities(sequelize, id, t);
    const hasChanges = activities ? some(activities, isModified) : true;
    return setHasChanges(sequelize, { id, hasChanges }, t);
  });
  await t.commit();
}

async function getRepositories(sequelize, transaction) {
  const sql = 'SELECT id AS "id" FROM repository;';
  return head(await sequelize.query(sql, { transaction, raw: true }));
}

async function getOutlineActivities(sequelize, repositoryId, transaction) {
  const sql = `
    SELECT
      id AS "id",
      type AS "type",
      repository_id AS "repositoryId",
      published_at AS "publishedAt",
      modified_at AS "modifiedAt"
    FROM
      activity
    WHERE
      type LIKE '%/%' AND
      repository_id = :repositoryId;
  `;
  const options = { transaction, replacements: { repositoryId }, raw: true };
  return head(await sequelize.query(sql, options));
}

function setHasChanges(sequelize, repository, transaction) {
  const { hasChanges, id: repositoryId } = repository;
  const sql = `
    UPDATE
      repository
    SET
      has_changes = :hasChanges
    WHERE
      id = :repositoryId
  `;
  const replacements = { hasChanges, repositoryId };
  return sequelize.query(sql, { transaction, replacements });
}
