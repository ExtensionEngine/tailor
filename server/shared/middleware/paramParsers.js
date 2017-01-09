const helpers = require('./helpers');
const { save } = require('../io').locals;

function parsePagination(req, res, next) {
  const { page, limit } = req.query;
  const { validateLimit, validatePage } = helpers;

  save(req, 'pagination', {
    limit: validateLimit(parseInt(limit)),
    page: validatePage(parseInt(page))
  });
  next();
}

function parseSort(req, res, next) {
  const { sortOrder, sortBy } = req.query;
  const { validateSortBy, validateSortOrder } = helpers;

  save(req, 'sort', {
    sortBy: validateSortBy(sortBy),
    sortOrder: validateSortOrder(sortOrder)
  });
  next();
}

function parseSearch(req, res, next) {
  const query = req.query.query;

  save(req, 'search', {
    query: helpers.validateQuery(query)
  });
  next();
}

module.exports = {
  parsePagination,
  parseSort,
  parseSearch
};
