const ctrl = require('./revision.controller');
const router = require('express-promise-router')();

router.get('/courses/:courseId/revisions', ctrl.index);
router.get('/courses/:courseId/revisions/:revId', ctrl.resolve);

module.exports = {
  controller: ctrl,
  router
};
