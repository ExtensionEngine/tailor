module.exports = {
  database: require('./database.js'),
  swagger: require('./swagger'),
  auth: require('./auth'),
  port: process.env.SERVER_PORT || 3000
}
