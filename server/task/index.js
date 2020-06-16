'use strict';

const { createError } = require('../shared/error/helpers');
const ctrl = require('./task.controller');
const { NOT_FOUND } = require('http-status-codes');
const { Task } = require('../shared/database');
const router = require('express').Router();

router.param('taskId', getTask);

router
  .get('/', ctrl.list)
  .post('/', ctrl.create)
  .patch('/:taskId', ctrl.patch)
  .patch('/:taskId/archive', ctrl.archive);

module.exports = {
  path: '/tasks',
  router
};

function getTask(req, _res, next, taskId) {
  return Task.findByPk(taskId, { paranoid: false })
  .then(task => task || createError(NOT_FOUND, 'Task not found'))
  .then(task => {
    req.task = task;
    next();
  });
}
