'use strict';

const { Revision, User } = require('../shared/database');
const { resolveStatics } = require('../shared/storage/helpers');
const revisionService = require('./revision.service');

function index({ repository, query }, res) {
  const { limit, offset, entity, publishedOn } = query;
  const filter = { ...query, repositoryId: repository.id };
  const include = [{
    model: User,
    paranoid: false,
    attributes: ['id', 'email', 'firstName', 'lastName', 'fullName', 'label']
  }];
  const opts = {
    include,
    order: [['createdAt', 'DESC']],
    limit,
    offset
  };
  if (publishedOn) {
    return revisionService.getPublished(filter, opts)
      .then(data => res.json({ data }));
  }
  if (entity) {
    return revisionService.getByEntity(filter, opts)
      .then(data => res.json({ data }));
  }
  return Revision.findAll(opts).then(data => res.json({ data }));
}

function resolve({ revision }, res) {
  return resolveStatics(revision.state).then(state => {
    revision.state = state;
    return res.json(revision);
  });
}

module.exports = {
  index,
  resolve
};
