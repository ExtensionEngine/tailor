const isEmpty = require('lodash/isEmpty');
const isInteger = require('lodash/isInteger');
const isString = require('lodash/isString');
const config = require('../../../config/server');

/**
 * Checks if page is a valid non-zero integer. Returns page if all
 * conditions are true, else it returns defaultPage.
 *
 * @param  {string} page Page number received from client.
 * @return {number} Page number received from client or defaultPage.
 */
function validatePage(page) {
  // parseInt rounds any floating point number to its floor value.
  // This way they are easily eliminated in a later, isInteger check.
  const parsedPage = parseFloat(page, 10);
  const defaultPage = config.queryParams.pagination.page;
  return isInteger(parsedPage) && parsedPage >= 1 ? parsedPage : defaultPage;
}

/**
 * Check if limit is lower than or equal to the default limit. Returns
 * limit if all conditions are true, else it returns defaultLimit.
 *
 * @param  {string} limit Number of items per page received from client.
 * @return {number} Limit received from client or defaultLimit.
 */
function validateLimit(limit) {
  const parsedLimit = parseFloat(limit, 10);
  const defaultLimit = config.queryParams.pagination.limit;
  return isInteger(parsedLimit) && parsedLimit > 0 && parsedLimit <= defaultLimit
    ? parsedLimit : defaultLimit;
}

/**
 * Check if order is ascending or descending. Returns order if all
 * conditions are true, else it returns default ordering.
 *
 * @param  {string} order Item ordering received from client.
 * @return {string} Ordering received from client or default ordering.
 */
function validateSortOrder(order) {
  const { ASC, DESC } = config.queryParams.sort.order;
  return order === ASC || order === DESC ? order : DESC;
}

/**
 * Check if sortBy is a valid, non-empty string. Returns sortBy if
 * all conditions are true, else it returns default sortBy field.
 *
 * @param  {string} sortBy Sort field received from client.
 * @return {string} Sort field received from client or default sort field.
 */
function validateSortBy(sortBy) {
  const defaultSortBy = config.queryParams.sort.field;
  return isString(sortBy) && !isEmpty(sortBy) ? sortBy : defaultSortBy;
}

/**
 * Check if query exists and is a string. Returns query if all conditions
 * are true, else it returns default query field.
 *
 * @param  {string} query Query value received from client.
 * @return {string} Query value received from client or default sort value.
 */
function validateQuery(query) {
  return isString(query) && !isEmpty(query) ? query : null;
}

module.exports = {
  validatePage,
  validateLimit,
  validateSortOrder,
  validateSortBy,
  validateQuery
};
