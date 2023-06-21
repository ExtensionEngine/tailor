import assign from 'lodash/assign.js';
import defaultsDeep from 'lodash/defaultsDeep.js';
import { Op } from 'sequelize';
import pick from 'lodash/pick.js';

const filter = {
  where: {},
  offset: 0,
  limit: null,
  order: [['id', 'ASC']],
  paranoid: true
};

export default function (defaults) {
  return function (req, res, next) {
    const order = [[req.query.sortBy, req.query.sortOrder]];
    const query = assign(pick(req.query, ['offset', 'limit', 'paranoid']), { order });
    const options = defaultsDeep({}, query, defaults, filter);

    if (query.integration) { options.paranoid = false; }

    if (query.syncedAt) {
      const condition = { $gte: query.syncedAt };
      options.where[Op.or] = [{ updatedAt: condition }, { deletedAt: condition }];
    }

    req.opts = options;

    next();
  };
}
