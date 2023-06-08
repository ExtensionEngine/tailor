import 'dotenv/config';
import createLogger from '../shared/logger.js';
import Promise from 'bluebird';
import { SCHEMAS } from '../../config/shared/tailor.loader.js';

createLogger.enabled = false;

// Dynamic import is needed in order for the `enabled` flag to be respected
const { default: db } = await import('../shared/database/index.js');

const { Activity, ContentElement, sequelize } = db;
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
