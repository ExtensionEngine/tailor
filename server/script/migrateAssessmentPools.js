'use strict';

const { Activity, ContentElement, sequelize } = require('../shared/database');
const Promise = require('bluebird');
const { SCHEMAS } = require('../../config/shared/activities');

const DEFAULTS = { data: {}, type: 'ASSESSMENT_POOL' };

const types = extractAssessedTypes(SCHEMAS);

migrateAssessmentContainers(types)
  .then(() => {
    console.info('Inserted assessment pools.');
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

async function migrateAssessmentContainers(type) {
  const transaction = await sequelize.transaction();
  const assessed = await Activity.findAll({ where: { type }, transaction });
  await Promise.each(assessed, it => migrateAssessmentContainer(it, transaction));
  return transaction.commit();
}

async function migrateAssessmentContainer(activity, transaction) {
  const { id } = await createAssessmentContainer(activity, transaction);
  return migrateContentElements(id, activity.id, transaction);
}

async function createAssessmentContainer(activity, transaction) {
  const { id: parentId, repositoryId } = activity;
  const data = { ...DEFAULTS, parentId, repositoryId, position: 1 };
  return Activity.create(data, { transaction });
}

function migrateContentElements(containerId, activityId, transaction) {
  const where = { activityId };
  const order = [['id', 'ASC']];
  return ContentElement
    .findAll({ where, order, transaction })
    .each((it, index) => {
      const updates = { activityId: containerId, position: index + 1 };
      return it.update(updates, { transaction });
    });
}
