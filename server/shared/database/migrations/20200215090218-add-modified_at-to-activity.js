'use strict';

const filter = require('lodash/filter');
const get = require('lodash/get');
const head = require('lodash/head');
const keyBy = require('lodash/keyBy');
const map = require('lodash/map');
const max = require('lodash/max');
const Promise = require('bluebird');
const transform = require('lodash/transform');

const TABLE = 'activity';
const COLUMN = 'modified_at';

const isOutline = it => /\//.test(it.type);

exports.up = async (qi, { DATE }) => {
  await qi.addColumn(TABLE, COLUMN, { type: DATE });
  await updateColumnValues(qi);
};

exports.down = qi => qi.removeColumn(TABLE, COLUMN);

async function updateColumnValues({ sequelize }) {
  const transaction = await sequelize.transaction();
  const repositories = await getRepositories(sequelize, transaction);
  await Promise.each(repositories, async ({ id: repositoryId }) => {
    const [activities, revisions] = await Promise.all([
      getActivities(sequelize, repositoryId, transaction),
      getRevisions(sequelize, repositoryId, transaction)
    ]);
    const cache = buildRevisionCache(activities, revisions);
    const outlineActivities = filter(activities, isOutline);
    await Promise.each(outlineActivities, activity => {
      const modifiedAt = resolveModifiedAt(activity, cache);
      const where = { modifiedAt, activityId: activity.id };
      return setModifiedAt(sequelize, where, transaction);
    });
  });
  await transaction.commit();
}

async function getRepositories(sequelize, transaction) {
  const sql = 'SELECT id FROM repository;';
  return head(await sequelize.query(sql, { transaction, raw: true }));
}

async function getRevisions(sequelize, repositoryId, transaction) {
  const sql = `
    SELECT
      entity,
      state -> 'id' AS "entityId",
      state -> 'parentId' AS "parentId",
      repository_id AS "repositoryId",
      CASE
        WHEN
          entity = 'ACTIVITY'
        THEN
          state -> 'id'
        ELSE
          state -> 'activityId'
      END
        AS "activityId",
      MAX(created_at) AS "createdAt"
    FROM
      revision
    WHERE
      repository_id = :repositoryId AND
      entity IN ( 'ACTIVITY', 'CONTENT_ELEMENT' )
    GROUP BY
      "entity", "entityId", "parentId", "repositoryId", "activityId";
  `;
  const options = { transaction, replacements: { repositoryId }, raw: true };
  return head(await sequelize.query(sql, options));
}

async function getActivities(sequelize, repositoryId, transaction) {
  const sql = `
    SELECT
      id,
      type,
      parent_id AS "parentId",
      repository_id AS "repositoryId"
    FROM
      activity
    WHERE
      repository_id = :repositoryId;
  `;
  const options = { transaction, replacements: { repositoryId }, raw: true };
  return head(await sequelize.query(sql, options));
}

function setModifiedAt(sequelize, where, transaction) {
  const sql = `
    UPDATE
      activity
    SET
      modified_at = :modifiedAt::timestamptz
    WHERE
      id = :activityId;
  `;
  return sequelize.query(sql, { transaction, replacements: where });
}

function buildRevisionCache(activities, revisions) {
  const keyedActivities = keyBy(activities, 'id');
  return transform(revisions, (acc, revision) => {
    const outlineId = getOutlineParentId(revision, keyedActivities);
    (acc[outlineId] || (acc[outlineId] = [])).push(revision);
  }, {});
}

function getOutlineParentId(revision, activities) {
  let activity = activities[revision.activityId];
  while (activity && !isOutline(activity)) {
    activity = activities[activity.parentId];
  }
  return get(activity, 'id');
}

function resolveModifiedAt(activity, cache) {
  const date = max(map(cache[activity.id], 'createdAt'));
  return (date || new Date()).toISOString();
}
