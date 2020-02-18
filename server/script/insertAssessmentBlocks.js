'use strict';

const { Activity, ContentElement, sequelize } = require('../shared/database');
const get = require('lodash/get');
const Promise = require('bluebird');
const { SCHEMAS } = require('../../config/shared/activities');

const DEFAULTS = { data: {}, type: 'ASSESSMENT_BLOCK' };

const types = extractAssessedTypes(SCHEMAS);

insertAssessmentBlocks(types)
  .then(() => {
    console.info('Inserted assessment blocks.');
    process.exit(0);
  })
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });

function extractAssessedTypes(schemas) {
  return schemas.reduce((types, { structure }) => {
    structure.forEach(it => it.hasAssessments && types.push(it.type));
    return types;
  }, []);
}

async function insertAssessmentBlocks(types) {
  const transaction = await sequelize.transaction();
  const assessed = await getAssessedActivitites(types, transaction);
  await Promise.each(assessed, it => insertAssessmentBlock(it, transaction));
  return transaction.commit();
}

function getAssessedActivitites(types, transaction) {
  const options = { where: { type: types }, transaction };
  return Activity.findAll(options);
}

async function insertAssessmentBlock(activity, transaction) {
  const { id } = await createAssessmentBlock(activity, transaction);
  return updateAssessments(id, activity.id, transaction);
}

async function createAssessmentBlock(activity, transaction) {
  const { id: parentId, repositoryId } = activity;
  const position = await getPosition(parentId, transaction);
  const data = { ...DEFAULTS, parentId, repositoryId, position };
  return Activity.create(data, { transaction });
}

function getPosition(parentId, transaction) {
  const where = { parentId };
  const order = [['position', 'DESC']];
  return Activity
    .findOne({ where, order, transaction })
    .then(it => get(it, 'position', 0) + 1);
}

function updateAssessments(blockId, activityId, transaction) {
  const where = { activityId };
  const order = [['id', 'ASC']];
  return ContentElement
    .findAll({ where, order, transaction })
    .each((it, index) => {
      const updates = { activityId: blockId, position: index + 1 };
      return it.update(updates, { transaction });
    });
}
