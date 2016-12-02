'use strict';

const express = require('express');
const courseRouter = require('./course').router;
const userRouter = require('./user').router;

const router = express.Router();
router.use(courseRouter);
router.use(userRouter);

module.exports = router;
