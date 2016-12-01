'use strict';

const express = require('express');
const courseRouter = require('./course').router;

const router = express.Router();
router.use('/courses', courseRouter);

module.exports = router;
