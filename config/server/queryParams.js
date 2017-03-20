module.exports = {
  pagination: {
    page: process.env.CURRENT_PAGE || 1,
    limit: process.env.ITEMS_PER_PAGE || 20
  },
  sort: {
    field: 'id',
    order: {
      ASC: 'ASC',
      DESC: 'DESC'
    }
  },
  syncOptions(query) {
    const options = {
      where: { },
      offset: parseInt(query.offset, 10) || 0,
      limit: parseInt(query.limit, 10) || 0,
      order: query.order,
      paranoid: false
    };

    if (query.lastSyncedAt) {
      const condition = { $gte: query.lastSyncedAt };
      options.where.$or = [{ updatedAt: condition }, { deletedAt: condition }];
    }

    return options;
  }
};
