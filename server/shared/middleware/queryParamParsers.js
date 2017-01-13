const validators = require('./queryParamValidators');
const { save } = require('../io').locals;

function parsePagination(req, res, next) {
  const { page, limit } = req.query;
  const { validateLimit, validatePage } = validators;

  save(req, 'pagination', {
    limit: validateLimit(limit),
    page: validatePage(page)
  });
  next();
}

function parseSort(req, res, next) {
  const { sortOrder, sortBy } = req.query;
  const { validateSortBy, validateSortOrder } = validators;

  save(req, 'sort', {
    sortBy: validateSortBy(sortBy),
    sortOrder: validateSortOrder(sortOrder)
  });
  next();
}

function parseSearch(req, res, next) {
  const query = req.query.search;

  save(req, 'search', {
    query: validators.validateQuery(query)
  });
  next();
}

module.exports = {
  parsePagination,
  parseSort,
  parseSearch
};
