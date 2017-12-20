module.exports = {
  auth: require('./auth'),
  storage: require('./storage'),
  port: process.env.SERVER_PORT || 3000
};
