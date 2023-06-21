import 'dotenv/config';
import createLogger from '../shared/logger.js';
import each from 'lodash/each.js';
import find from 'lodash/find.js';
import omit from 'lodash/omit.js';

createLogger.enabled = false;

// Dynamic imports are needed in order for the `enabled` flag to be respected
const {
  getRepositoryAttrs,
  getRepositoryCatalog
} = await import('../shared/publishing/helpers.js');
const { default: db } = await import('../shared/database/index.js');
const { default: storage } = await import('../repository/storage.js');

const { Repository } = db;

Repository.findAll({ paranoid: false })
  .then(repositories => repositories.length && updateRepositoryCatalog(repositories))
  .then(() => console.info('Catalog updated!'))
  .finally(() => process.exit(0));

function updateRepositoryCatalog(repositories) {
  console.info('Fetching repo catalog from S3...');
  return getRepositoryCatalog().then(catalog => {
    console.info('Catalog fetched ...');
    console.info('Updating deleted repos ...');
    each(catalog, catalogItem => {
      const repository = find(repositories, { id: catalogItem.id });
      const repositoryData = {
        ...getRepositoryAttrs(repository),
        detachedAt: repository.deletedAt
      };
      Object.assign(catalogItem, omit(repositoryData, ['id']));
    });
    const data = Buffer.from(JSON.stringify(catalog), 'utf8');
    return storage.saveFile('repository/index.json', data);
  });
}
