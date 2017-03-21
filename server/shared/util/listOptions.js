const map = require('lodash/map');
const { Activity } = require('../database');

module.exports = function build(query, type) {
  const options = {
    offset: parseInt(query.offset, 10) || 0,
    limit: parseInt(query.limit, 10) || null,
    order: [[query.sortBy || 'id', query.sortOrder || 'ASC']],
    paranoid: !query.integration
  };

  const where = {};
  if (query.search) where.name = { $iLike: `%${query.search}%` };
  if (query.exclude) where.id = { $notIn: map(query.exclude, num => parseInt(num, 10)) };

  if (type === 'tes') {
    if (query.integration) {
      where.courseId = { $eq: query.courseId };
    } else {
      where.$or = [];
      if (query.activityId) where.$or.push({ id: parseInt(query.activityId, 10) });
      if (query.parentId) where.$or.push({ parentId: parseInt(query.parentId, 10) });
      options.model = Activity;
      options.attributes = [];
    }
  }

  if (query.syncedAt) {
    const condition = { $gte: query.syncedAt };
    where.$or = [{ updatedAt: condition }, { deletedAt: condition }];
  }

  options.where = where;
  return options;
};
