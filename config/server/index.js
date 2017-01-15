module.exports = {
  auth: require('./auth'),
  database: require('./database.js'),
  error: require('./error'),
  queryParams: require('./queryParams'),
  swagger: require('./swagger'),
  port: process.env.SERVER_PORT || 3000
};
