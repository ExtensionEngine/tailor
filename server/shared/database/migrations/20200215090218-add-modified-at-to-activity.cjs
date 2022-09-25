'use strict';

const filter = require('lodash/filter');
const head = require('lodash/head');
const keyBy = require('lodash/keyBy');
const max = require('lodash/max');
const Promise = require('bluebird');
const transform = require('lodash/transform');

const TABLE = 'activity';
const COLUMN = 'modified_at';

const isOutlineActivity = it => /\//.test(it.type);

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
    const cache = buildModifiedAtCache(activities, revisions);
    const outlineActivities = filter(activities, isOutlineActivity);
    await Promise.each(outlineActivities, ({ id }) => {
      const maxDate = (cache[id] || new Date()).toISOString();
      const data = { modifiedAt: maxDate, activityId: id };
      return setModifiedAt(sequelize, data, transaction);
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

function setModifiedAt(sequelize, data, transaction) {
  const sql = `
    UPDATE
      activity
    SET
      modified_at = :modifiedAt::timestamptz
    WHERE
      id = :activityId;
  `;
  return sequelize.query(sql, { transaction, replacements: data });
}

function buildModifiedAtCache(activities, revisions) {
  const keyedActivities = keyBy(activities, 'id');
  return transform(revisions, (acc, { activityId, createdAt }) => {
    const id = getOutlineParentId(activityId, keyedActivities);
    acc[id] = max([createdAt, acc[id]]);
  }, {});
}

function getOutlineParentId(activityId, activities) {
  const activity = activities[activityId];
  if (!activity) return null;
  return isOutlineActivity(activity)
    ? activity.id
    : getOutlineParentId(activity.parentId, activities);
}
