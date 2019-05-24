'use strict';

const activityRouter = require('./activity').router;
const auth = require('./shared/auth').authenticate('jwt');
const commentRouter = require('./comment').router;
const courseRouter = require('./course').router;
const express = require('express');
const revisionRouter = require('./revision').router;
const storageRouter = require('./shared/storage/storage.router').router;
const teRouter = require('./teaching-element').router;
const userRouter = require('./user').router;

const router = express.Router();
router.use(processBody);

// Public routes:
router.use('/', userRouter);

// Protected routes:
router.use('/', auth);
router.use('/', courseRouter);
router.use('/', activityRouter);
router.use('/', commentRouter);
router.use('/', teRouter);
router.use('/', revisionRouter);
router.use('/', storageRouter);
router.use('/', userRouter);

module.exports = router;

function processBody(req, _res, next) {
  const { body } = req;
  if (body && body.email) body.email = body.email.toLowerCase();
  next();
}
