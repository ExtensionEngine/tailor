const ctrl = require('./revision.controller');
const router = require('express-promise-router')();

router.get('/courses/:courseId/revisions', ctrl.index);

module.exports = {
  controller: ctrl,
  router
};
