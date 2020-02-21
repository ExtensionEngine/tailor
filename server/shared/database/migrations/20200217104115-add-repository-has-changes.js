'use strict';

const groupBy = require('lodash/groupBy');
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
  const transaction = await sequelize.transaction();
  const repositories = await getRepositories(sequelize, transaction);
  const activities = await getActivities(sequelize, transaction);
  const groupedActivities = groupBy(activities, 'repositoryId');
  await Promise.map(repositories, ({ id }) => {
    const outlineActivities = groupedActivities[id];
    const hasChanges = outlineActivities
      ? some(outlineActivities, isModified)
      : true;
    return setHasChanges(sequelize, transaction, id, hasChanges);
  });
  await transaction.commit();
}

async function getRepositories(sequelize, transaction) {
  const sql = `
    SELECT
      id AS "id"
    FROM
      repository;
  `;
  return head(await sequelize.query(sql, { transaction, raw: true }));
}

async function getActivities(sequelize, transaction) {
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
      type LIKE '%/%';
  `;
  return head(await sequelize.query(sql, { transaction, raw: true }));
}

function setHasChanges(sequelize, transaction, repositoryId, hasChanges) {
  const sql = `
    UPDATE
      repository
    SET
      has_changes = ${hasChanges}
    WHERE
      id = ${repositoryId}
  `;
  return sequelize.query(sql, { transaction });
}
