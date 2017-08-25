const merge = require('lodash/merge');
module.exports = (...configs) => merge({}, ...configs);
