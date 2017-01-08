module.exports = {
  auth: require('./auth'),
  database: require('./database.js'),
  error: require('./error'),
  params: require('./params'),
  swagger: require('./swagger'),
  port: process.env.SERVER_PORT || 3000
};
