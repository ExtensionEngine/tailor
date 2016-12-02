module.exports = {
  database: require('./database.js'),
  swagger: require('./swagger'),
  port: process.env.SERVER_PORT || 3000
}
