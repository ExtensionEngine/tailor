module.exports = {
  auth: require('./auth'),
  queryParams: require('./queryParams'),
  storage: require('./storage'),
  swagger: require('./swagger'),
  port: process.env.SERVER_PORT || 3000
};
