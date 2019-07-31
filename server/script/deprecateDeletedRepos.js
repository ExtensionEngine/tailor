const { Course, Sequelize } = require('../shared/database');
const each = require('lodash/each');
const omit = require('lodash/omit');
const find = require('lodash/find');
const Op = Sequelize.Op;
const storage = require('../shared/storage');
const { getRepositoryAttrs } = require('../shared/publishing/helpers');

Course.findAll({ where: { deletedAt: { [Op.ne]: null } }, paranoid: false })
  .then(deletedRepos => deletedRepos.length && updateRepositoryCatalog(deletedRepos))
  .then(() => console.info('Catalog updated!'))
  .finally(() => process.exit(0));

function updateRepositoryCatalog(repositories) {
  console.info('Fetching repo catalog from S3...');
  return storage.getFile('repository/index.json').then(buffer => {
    console.info('Catalog fetched ...');
    let catalog = (buffer && JSON.parse(buffer.toString('utf8'))) || [];
    console.info('Updating deprecated repos ...');
    each(repositories, repo => {
      let existing = find(catalog, { id: repo.id });
      if (!existing) return;
      const repositoryData = { ...getRepositoryAttrs(repo), deprecatedAt: repo.deletedAt };
      Object.assign(existing, omit(repositoryData, ['id']));
    });
    const data = Buffer.from(JSON.stringify(catalog), 'utf8');
    return storage.saveFile('repository/index.json', data);
  });
}
