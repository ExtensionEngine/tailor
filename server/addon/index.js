const ctrl = require('./addon.controller');
const router = require('express-promise-router')();

router
  .get('/addons', ctrl.list)
  .post('/addons/install', ctrl.install)
  .post('/addons/uninstall', ctrl.uninstall);

module.exports = { router };
