const path = require('path');

const modulesPath = process.env.MODULES_PATH ||
                    path.resolve(__dirname, '../../tailor_modules/');

module.exports = {
  auth: require('./auth'),
  storage: require('./storage'),
  port: process.env.SERVER_PORT || 3000,
  modulesPath
};
