'use strict';

const express = require('express');
const assetRouter = require('./asset').router;
const courseRouter = require('./course').router;
const userRouter = require('./user').router;

const router = express.Router();
router.use(assetRouter);
router.use(courseRouter);
router.use(userRouter);

module.exports = router;
