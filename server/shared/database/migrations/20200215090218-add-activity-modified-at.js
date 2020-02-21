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
  await updateModifiedAt(qi);
};

exports.down = qi => qi.removeColumn(TABLE, COLUMN);

async function updateModifiedAt({ sequelize }) {
  const transaction = await sequelize.transaction();
  const [activities, revisions] = await Promise.all([
    getActivities(sequelize, transaction),
    getRevisions(sequelize, transaction)
  ]);
  const cache = buildRevisionCache(activities, revisions);
  const outlineActivities = filter(activities, isOutline);
  await Promise.map(outlineActivities, activity => {
    const modifiedAt = resolveModifiedAt(activity, cache);
    return setModifiedAt(sequelize, transaction, activity, modifiedAt);
  });
  await transaction.commit();
}

async function getRevisions(sequelize, transaction) {
  const sql = `
    SELECT
      entity AS "entity",
      state -> 'id' AS "entityId",
      state -> 'parentId' AS "parentId",
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
      entity IN
      (
        'ACTIVITY',
        'CONTENT_ELEMENT'
      )
    GROUP BY
      "entity",
      "entityId",
      "parentId",
      "activityId";
  `;
  return head(await sequelize.query(sql, { transaction, raw: true }));
}

async function getActivities(sequelize, transaction) {
  const sql = `
    SELECT
      id AS "id",
      type AS "type",
      parent_id AS "parentId"
    FROM
      activity;
  `;
  return head(await sequelize.query(sql, { transaction, raw: true }));
}

function setModifiedAt(sequelize, transaction, activity, modifiedAt) {
  const sql = `
    UPDATE
      activity
    SET
      modified_at = '${modifiedAt}'::timestamptz
    WHERE
      id = ${activity.id};
  `;
  return sequelize.query(sql, { transaction });
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
