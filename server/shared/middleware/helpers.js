const config = require('../../../config/server');

/**
 * Checks if page is a valid non-zero integer. Returns page if all
 * conditions are true, else it returns defaultPage.
 *
 * @param  {Number} page Page number received from client.
 * @return {Number}      Page number received from client or defaultPage.
 */
function validatePage(page) {
  const defaultPage = config.params.pagination.page;
  return page && Number.isInteger(page) && page >= 1
    ? Math.floor(page) : defaultPage;
}

/**
 * Check if limit is lower than or equal to the default limit. Returns
 * limit if all conditions are true, else it returns defaultLimit.
 *
 * @param  {Number} limit Number of items per page received from client.
 * @return {Number}       Limit received from client or defaultLimit.
 */
function validateLimit(limit) {
  const defaultLimit = config.params.pagination.limit;
  return limit && Number.isInteger(limit) && limit <= defaultLimit
    ? Math.floor(limit) : defaultLimit;
}

/**
 * Check if order is ascending or descending. Returns order if all
 * conditions are true, else it returns default ordering.
 *
 * @param  {Number} order Item ordering received from client.
 * @return {Number}       Ordering received from client or default ordering.
 */
function validateSortOrder(order) {
  const { ASC, DESC } = config.params.sort.sortOrder;
  return order === ASC || order === DESC ? order : DESC;
}

/**
 * Check if sortBy is a valid, non-empty string. Returns sortBy if
 * all conditions are true, else it returns default sortBy field.
 *
 * @param  {String} sortBy Sort field received from client.
 * @return {String}        Sort field received from client or default sort field.
 */
function validateSortBy(sortBy) {
  const defaultSortBy = config.params.sort.sortBy;
  return sortBy && (typeof sortBy === 'string' || sortBy instanceof String) && sortBy.length
    ? sortBy : defaultSortBy;
}

/**
 * Check if query exists and is a string. Returns query if all conditions
 * are true, else it returns default query field.
 *
 * @param  {String} query Query value received from client.
 * @return {String}       Query value received from client or default sort value.
 */
function validateQuery(query) {
  const defaultQuery = config.params.search.query;
  return query && (typeof query === 'string' || query instanceof String)
    ? query : defaultQuery;
}

module.exports = {
  validatePage,
  validateLimit,
  validateSortOrder,
  validateSortBy,
  validateQuery
};
