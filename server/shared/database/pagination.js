import { parsePath } from './helpers.js';
import pick from 'lodash/pick.js';

const parseOptions = ({ limit, offset, sortOrder }) => ({
  limit: parseInt(limit, 10) || 100,
  offset: parseInt(offset, 10) || 0,
  sortOrder: sortOrder || 'ASC'
});

function processPagination(Model) {
  return (req, _, next) => {
    const options = parseOptions(req.query);
    Object.assign(req.query, options);
    req.options = pick(options, ['limit', 'offset']);
    const { sortBy } = req.query;
    if (sortBy) {
      req.options.order = [[...parsePath(sortBy, Model), options.sortOrder]];
    }
    next();
  };
}

export {
  processPagination
};
