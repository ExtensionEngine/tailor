module.exports = function build(query) {
  const options = {
    where: {},
    offset: parseInt(query.offset, 10) || 0,
    limit: parseInt(query.limit, 10) || null,
    order: [[query.sortBy || 'id', query.sortOrder || 'ASC']],
    paranoid: !query.integration
  };

  if (query.syncedAt) {
    const condition = { $gte: query.syncedAt };
    options.where.$or = [{ updatedAt: condition }, { deletedAt: condition }];
  }

  return options;
};
