'use strict';

const params = require('../../config/server').queryParams;
const userRoles = require('../../config/shared').role.user;
const { Course } = require('../shared/database/sequelize');

function index(req, res) {
  const user = req.user;
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || params.pagination.limit;
  const order = [[
    req.query.sortBy || params.sort.field,
    req.query.sortOrder || params.sort.order.ASC
  ]];
  const where = req.query.search
    ? { name: { $iLike: `%${req.query.search}%` } }
    : undefined;

  const promise = user.role === userRoles.ADMIN
    ? Course.findAll({ offset, limit, order, where })
    : user.getCourses({ offset, limit, order, where });

  return promise.then(courses => res.json({ data: courses }));
};

module.exports = {
  index
};
