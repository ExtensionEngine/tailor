import assign from 'lodash/assign';
import defaultsDeep from 'lodash/defaultsDeep';
import { Op } from 'sequelize';
import pick from 'lodash/pick';

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
