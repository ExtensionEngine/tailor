'use strict';

const activityRouter = require('./activity').router;
const auth = require('passport').authenticate('jwt');
const commentRouter = require('./comment').router;
const repositoryRouter = require('./repository').router;
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
router.use('/', repositoryRouter);
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
