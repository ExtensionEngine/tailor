'use strict';

const { Tag, RepositoryTag } = require('../shared/database');

function list({ repository }, res) {
  return repository.getTags()
    .then(tags => res.json({ data: tags }));
}

async function create({ body, repository }, res) {
  const tag = await Tag.create({ name: body.name });

  await RepositoryTag.create({
    tagId: tag.id,
    repositoryId: repository.id
  });
  return res.json({ data: tag });
}

module.exports = {
  list,
  create
};
