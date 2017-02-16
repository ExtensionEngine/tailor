'use strict';

const express = require('express');
const activityRouter = require('./activity').router;
const assessmentRouter = require('./assessment').router;
const assetRouter = require('./asset').router;
const courseRouter = require('./course').router;
const userRouter = require('./user').router;

const router = express.Router();
router.use('/', courseRouter);
router.use('/', activityRouter);
router.use('/', assessmentRouter);
router.use('/', assetRouter);
router.use('/', userRouter);

module.exports = router;
