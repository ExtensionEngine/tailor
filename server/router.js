'use strict';

const express = require('express');
const assetRouter = require('./asset').router;
const activityRouter = require('./activity').router;
const courseRouter = require('./course').router;
const userRouter = require('./user').router;

const router = express.Router();
router.use('/', courseRouter);
router.use('/', assetRouter);
router.use('/', activityRouter);
router.use('/', userRouter);

module.exports = router;
