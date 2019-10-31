'use strict';

const { authenticate } = require('./shared/auth');
const comment = require('./comment');
const course = require('./course');
const express = require('express');
const storage = require('./shared/storage/storage.router');
const user = require('./user');

const router = express.Router();
router.use(processBody);

// Public routes:
router.use(user.path, user.router);

// Protected routes:
router.use(authenticate('jwt'));
router.use(course.path, course.router);
router.use(storage.path, storage.router);
router.use(comment.path, comment.router);

module.exports = router;

function processBody(req, _res, next) {
  const { body } = req;
  if (body && body.email) body.email = body.email.toLowerCase();
  next();
}
