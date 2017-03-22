module.exports = {
  auth: require('./auth'),
  storage: require('./storage'),
  swagger: require('./swagger'),
  port: process.env.SERVER_PORT || 3000
};
