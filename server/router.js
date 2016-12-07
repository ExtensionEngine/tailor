'use strict';

const express = require('express');
const activityRouter = require('./activity').router;
const courseRouter = require('./course').router;
const userRouter = require('./user').router;

const router = express.Router();
router.use('/', activityRouter);
router.use('/', courseRouter);
router.use('/', userRouter);

module.exports = router;
