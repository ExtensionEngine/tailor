'use strict';

const { getRepositoryAttrs, getRepositoryCatalog } = require('../shared/publishing/helpers');
const each = require('lodash/each');
const omit = require('lodash/omit');
const find = require('lodash/find');
const { Repository } = require('../shared/database');
const storage = require('../shared/storage');

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
