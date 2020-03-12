'use strict';

const { Activity, ContentElement, sequelize } = require('../shared/database');
const Promise = require('bluebird');
const { SCHEMAS } = require('../../config/shared/activities');

const DEFAULTS = { data: {}, type: 'ASSESSMENT_POOL' };

const types = extractAssessedTypes(SCHEMAS);

migrateAssessmentContainers(types)
  .then(() => {
    console.info('Inserted assessment blocks.');
    process.exit(0);
  })
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });

function extractAssessedTypes(schemas) {
  return schemas
    .reduce((items, { structure }) => {
      return items.concat(structure.filter(it => it.hasAssessments));
    }, [])
    .map(it => it.type);
}

async function migrateAssessmentContainers(types) {
  const transaction = await sequelize.transaction();
  const assessed = await getAssessedActivitites(types, transaction);
  await Promise.each(assessed, it => migrateAssessmentContainer(it, transaction));
  return transaction.commit();
}

function getAssessedActivitites(types, transaction) {
  const options = { where: { type: types }, transaction };
  return Activity.findAll(options);
}

async function migrateAssessmentContainer(activity, transaction) {
  const { id } = await createAssessmentBlock(activity, transaction);
  return migrateContentElements(id, activity.id, transaction);
}

async function createAssessmentBlock(activity, transaction) {
  const { id: parentId, repositoryId } = activity;
  const data = { ...DEFAULTS, parentId, repositoryId, position: 1 };
  return Activity.create(data, { transaction });
}

function migrateContentElements(blockId, activityId, transaction) {
  const where = { activityId };
  const order = [['id', 'ASC']];
  return ContentElement
    .findAll({ where, order, transaction })
    .each((it, index) => {
      const updates = { activityId: blockId, position: index + 1 };
      return it.update(updates, { transaction });
    });
}
