'use strict';

const express = require('express');
const activityRouter = require('./activity').router;
const commentRouter = require('./comment').router;
const courseRouter = require('./course').router;
const editorsRouter = require('./editors').router;
const revisionRouter = require('./revision').router;
const teRouter = require('./teaching-element').router;
const userRouter = require('./user').router;

const router = express.Router();
router.use(processBody);
router.use('/', courseRouter);
router.use('/', activityRouter);
router.use('/', commentRouter);
router.use('/', editorsRouter);
router.use('/', teRouter);
router.use('/', revisionRouter);
router.use('/', userRouter);

module.exports = router;

function processBody(req, res, next) {
  const { body } = req;
  if (body && body.email) body.email = body.email.toLowerCase();
  next();
}
